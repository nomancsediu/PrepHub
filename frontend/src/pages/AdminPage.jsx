import { useState, useEffect } from 'react';
import RichEditor from '../components/RichEditor';
import { useTheme } from '../context/ThemeContext';
import {
  adminLogin,
  adminGetSubjects, adminCreateSubject, adminUpdateSubject, adminDeleteSubject,
  adminGetTopics, adminCreateTopic, adminUpdateTopic, adminDeleteTopic,
  adminGetLessons, adminCreateLesson, adminUpdateLesson, adminDeleteLesson,
  translateContent,
} from '../services/api';

const TABS = ['Subjects', 'Topics', 'Lessons'];
const emptySubject = { title: '', description: '', icon: 'fa-book' };
const emptyTopic   = { title: '', subject: '', order: 0 };
const emptyLesson  = { title: '', topic: '', order: 0, difficulty: 'Easy', summary: '', content: '', content_bn: '' };

const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
const btn = (color) => `px-3 py-1.5 rounded-lg text-sm font-medium text-white ${color} transition-colors`;

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {children}
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin(form);
      localStorage.setItem('admin_token', res.data.token);
      onLogin();
    } catch {
      setErr('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <form onSubmit={submit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 rounded-xl shadow w-80 space-y-4">
        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100">Admin Login</h1>
        {err && <p className="text-red-500 text-sm text-center">{err}</p>}
        <input className={inp} placeholder="Username" value={form.username}
          onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
        <input className={inp} type="password" placeholder="Password" value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

function SubjectForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptySubject);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try { await onSave(form); onClose(); } catch {}
  };

  return (
    <form onSubmit={submit}>
      <Field label="Title"><input className={inp} value={form.title} onChange={e => set('title', e.target.value)} required /></Field>
      <Field label="Description"><textarea className={inp} rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></Field>
      <Field label="Icon"><input className={inp} value={form.icon} onChange={e => set('icon', e.target.value)} /></Field>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onClose} className={btn('bg-gray-400 hover:bg-gray-500')}>Cancel</button>
        <button type="submit" className={btn('bg-blue-600 hover:bg-blue-700')}>Save</button>
      </div>
    </form>
  );
}

function TopicForm({ initial, subjects, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptyTopic);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try { await onSave(form); onClose(); } catch {}
  };

  return (
    <form onSubmit={submit}>
      <Field label="Subject">
        <select className={inp} value={form.subject} onChange={e => set('subject', e.target.value)} required>
          <option value="">-- Select Subject --</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </Field>
      <Field label="Title"><input className={inp} value={form.title} onChange={e => set('title', e.target.value)} required /></Field>
      <Field label="Order"><input className={inp} type="number" value={form.order} onChange={e => set('order', +e.target.value)} /></Field>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onClose} className={btn('bg-gray-400 hover:bg-gray-500')}>Cancel</button>
        <button type="submit" className={btn('bg-blue-600 hover:bg-blue-700')}>Save</button>
      </div>
    </form>
  );
}

function LessonPage({ initial, topics, subjects, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptyLesson);
  const [selectedSubject, setSelectedSubject] = useState(() => {
    if (initial?.topic) {
      const t = topics.find(t => t.id === +initial.topic);
      return t ? String(t.subject) : '';
    }
    return '';
  });
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleTranslate = async () => {
    if (!form.content_bn) return alert('Please write Bangla content first.');
    setTranslating(true);
    try {
      const res = await translateContent(form.content_bn);
      set('content', res.data.content);
    } catch {
      alert('Translation failed. Try again.');
    } finally {
      setTranslating(false);
    }
  };

  const filteredTopics = selectedSubject
    ? topics.filter(t => String(t.subject) === selectedSubject)
    : topics;

  const submit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch {} finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 text-sm flex items-center gap-1">
            ← Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{initial ? 'Edit Lesson' : 'New Lesson'}</h2>
        </div>
        <button onClick={submit} disabled={saving}
          className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Lesson'}
        </button>
      </div>

      {/* Body */}
      <form onSubmit={submit} className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Subject">
              <select className={inp} value={selectedSubject}
                onChange={e => { setSelectedSubject(e.target.value); set('topic', ''); }}>
                <option value="">-- Select Subject --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </Field>
            <Field label="Topic">
              <select className={inp} value={form.topic} onChange={e => set('topic', e.target.value)} required>
                <option value="">-- Select Topic --</option>
                {filteredTopics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Title">
            <input className={inp} value={form.title} onChange={e => set('title', e.target.value)} required />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Difficulty">
              <select className={inp} value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </Field>
            <Field label="Order">
              <input className={inp} type="number" value={form.order} onChange={e => set('order', +e.target.value)} />
            </Field>
          </div>

          <Field label="Summary">
            <textarea className={inp} rows={2} value={form.summary} onChange={e => set('summary', e.target.value)} />
          </Field>

          <Field label="Content (English)">
            <RichEditor value={form.content} onChange={v => set('content', v)} />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content (বাংলা) — optional</label>
              <button type="button" onClick={handleTranslate} disabled={translating}
                className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50">
                {translating ? '⏳ Translating...' : '✨ Translate to English'}
              </button>
            </div>
            <RichEditor value={form.content_bn} onChange={v => set('content_bn', v)} />
          </div>

        </div>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('admin_token'));
  const [tab, setTab] = useState('Subjects');
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [modal, setModal] = useState(null);
  const { dark, toggle } = useTheme();

  const load = async () => {
    const [s, t, l] = await Promise.all([adminGetSubjects(), adminGetTopics(), adminGetLessons()]);
    setSubjects(Array.isArray(s.data) ? s.data : (s.data.results ?? []));
    setTopics(Array.isArray(t.data) ? t.data : (t.data.results ?? []));
    setLessons(Array.isArray(l.data) ? l.data : (l.data.results ?? []));
  };

  useEffect(() => { if (authed) load(); }, [authed]);

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;

  const closeModal = () => setModal(null);

  const saveSubject = async (form, item) => {
    try {
      if (item) await adminUpdateSubject(item.id, form);
      else await adminCreateSubject(form);
      await load();
    } catch (e) {
      alert('Error: ' + (e.response?.data ? JSON.stringify(e.response.data) : e.message));
      throw e;
    }
  };

  const saveTopic = async (form, item) => {
    try {
      if (item) await adminUpdateTopic(item.id, form);
      else await adminCreateTopic(form);
      await load();
    } catch (e) {
      alert('Error: ' + (e.response?.data ? JSON.stringify(e.response.data) : e.message));
      throw e;
    }
  };

  const saveLesson = async (form, item) => {
    try {
      if (item) await adminUpdateLesson(item.id, form);
      else await adminCreateLesson(form);
      await load();
    } catch (e) {
      alert('Error: ' + (e.response?.data ? JSON.stringify(e.response.data) : e.message));
      throw e;
    }
  };

  const del = async (type, id) => {
    if (!confirm('Delete?')) return;
    if (type === 'subject') await adminDeleteSubject(id);
    if (type === 'topic') await adminDeleteTopic(id);
    if (type === 'lesson') await adminDeleteLesson(id);
    load();
  };

  const subjectName = (id) => subjects.find(s => s.id === +id)?.title || '—';
  const topicName   = (id) => topics.find(t => t.id === +id)?.title || '—';
  const diffColor = {
    Easy: 'text-green-600 dark:text-green-400',
    Medium: 'text-yellow-600 dark:text-yellow-400',
    Hard: 'text-red-600 dark:text-red-400'
  };

  const thCls = "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider";
  const tdCls = "px-4 py-3 text-sm text-gray-700 dark:text-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Admin Panel</h1>
        <div className="flex items-center gap-3">
          <button onClick={toggle}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => { localStorage.removeItem('admin_token'); setAuthed(false); }}
            className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Subjects Tab ── */}
        {tab === 'Subjects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">Subjects ({subjects.length})</h2>
              <button onClick={() => setModal({ type: 'subject' })} className={btn('bg-blue-600 hover:bg-blue-700')}>+ New Subject</button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className={thCls}>Title</th>
                    <th className={thCls}>Slug</th>
                    <th className={thCls}>Icon</th>
                    <th className={thCls}>Description</th>
                    <th className={thCls} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {subjects.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className={`${tdCls} font-medium text-gray-900 dark:text-gray-100`}>{s.title}</td>
                      <td className={`${tdCls} text-gray-400`}>{s.slug}</td>
                      <td className={tdCls}>{s.icon}</td>
                      <td className={`${tdCls} max-w-xs truncate`}>{s.description}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end flex-wrap">
                          <button onClick={() => adminUpdateSubject(s.id, { ...s, is_published: !s.is_published }).then(load)}
                            className={btn(s.is_published ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500')}>
                            {s.is_published ? 'Published' : 'Draft'}
                          </button>
                          <button onClick={() => setModal({ type: 'subject', item: s })} className={btn('bg-yellow-500 hover:bg-yellow-600')}>Edit</button>
                          <button onClick={() => del('subject', s.id)} className={btn('bg-red-500 hover:bg-red-600')}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Topics Tab ── */}
        {tab === 'Topics' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">Topics ({topics.length})</h2>
              <button onClick={() => setModal({ type: 'topic' })} className={btn('bg-blue-600 hover:bg-blue-700')}>+ New Topic</button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className={thCls}>Title</th>
                    <th className={thCls}>Subject</th>
                    <th className={thCls}>Order</th>
                    <th className={thCls} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {topics.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className={`${tdCls} font-medium text-gray-900 dark:text-gray-100`}>{t.title}</td>
                      <td className={tdCls}>{subjectName(t.subject)}</td>
                      <td className={tdCls}>{t.order}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setModal({ type: 'topic', item: t })} className={btn('bg-yellow-500 hover:bg-yellow-600')}>Edit</button>
                          <button onClick={() => del('topic', t.id)} className={btn('bg-red-500 hover:bg-red-600')}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Lessons Tab ── */}
        {tab === 'Lessons' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">Lessons ({lessons.length})</h2>
              <button onClick={() => setModal({ type: 'lesson' })} className={btn('bg-blue-600 hover:bg-blue-700')}>+ New Lesson</button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className={thCls}>Title</th>
                    <th className={thCls}>Topic</th>
                    <th className={thCls}>Difficulty</th>
                    <th className={thCls}>Order</th>
                    <th className={thCls} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {lessons.map(l => (
                    <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className={`${tdCls} font-medium text-gray-900 dark:text-gray-100`}>{l.title}</td>
                      <td className={tdCls}>{topicName(l.topic)}</td>
                      <td className={`px-4 py-3 text-sm font-medium ${diffColor[l.difficulty]}`}>{l.difficulty}</td>
                      <td className={tdCls}>{l.order}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setModal({ type: 'lesson', item: l })} className={btn('bg-yellow-500 hover:bg-yellow-600')}>Edit</button>
                          <button onClick={() => del('lesson', l.id)} className={btn('bg-red-500 hover:bg-red-600')}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal?.type === 'subject' && (
        <Modal title={modal.item ? 'Edit Subject' : 'New Subject'} onClose={closeModal}>
          <SubjectForm initial={modal.item} onSave={(form) => saveSubject(form, modal.item)} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === 'topic' && (
        <Modal title={modal.item ? 'Edit Topic' : 'New Topic'} onClose={closeModal}>
          <TopicForm initial={modal.item} subjects={subjects} onSave={(form) => saveTopic(form, modal.item)} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === 'lesson' && (
        <LessonPage initial={modal.item} topics={topics} subjects={subjects} onSave={(form) => saveLesson(form, modal.item)} onClose={closeModal} />
      )}
    </div>
  );
}
