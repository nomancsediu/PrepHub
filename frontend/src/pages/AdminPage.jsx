import { useState, useEffect } from 'react';
import RichEditor from '../components/RichEditor';
import {
  adminLogin,
  adminGetSubjects, adminCreateSubject, adminUpdateSubject, adminDeleteSubject,
  adminGetTopics, adminCreateTopic, adminUpdateTopic, adminDeleteTopic,
  adminGetLessons, adminCreateLesson, adminUpdateLesson, adminDeleteLesson,
} from '../services/api';

// ── helpers ──────────────────────────────────────────────────────────────────
const TABS = ['Subjects', 'Topics', 'Lessons'];

const emptySubject = { title: '', description: '', icon: 'fa-book' };
const emptyTopic   = { title: '', subject: '', order: 0 };
const emptyLesson  = { title: '', topic: '', order: 0, difficulty: 'Easy', summary: '', content: '' };

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const btn = (color) => `px-3 py-1.5 rounded-lg text-sm font-medium text-white ${color}`;

// ── Login ─────────────────────────────────────────────────────────────────────
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">Admin Login</h1>
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

// ── Subject Form ──────────────────────────────────────────────────────────────
function SubjectForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptySubject);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await onSave(form);
      onClose();
    } catch { /* error shown by parent */ }
  };

  return (
    <form onSubmit={submit}>
      <Field label="Title"><input className={inp} value={form.title} onChange={e => set('title', e.target.value)} required /></Field>
      <Field label="Description"><textarea className={inp} rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></Field>
      <Field label="Icon"><input className={inp} value={form.icon} onChange={e => set('icon', e.target.value)} /></Field>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onClose} className={btn('bg-gray-400')}>Cancel</button>
        <button type="submit" className={btn('bg-blue-600')}>Save</button>
      </div>
    </form>
  );
}

// ── Topic Form ────────────────────────────────────────────────────────────────
function TopicForm({ initial, subjects, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptyTopic);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await onSave(form);
      onClose();
    } catch { /* error shown by parent */ }
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
        <button type="button" onClick={onClose} className={btn('bg-gray-400')}>Cancel</button>
        <button type="submit" className={btn('bg-blue-600')}>Save</button>
      </div>
    </form>
  );
}

// ── Lesson Full Page ──────────────────────────────────────────────────────────
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
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const filteredTopics = selectedSubject
    ? topics.filter(t => String(t.subject) === selectedSubject)
    : topics;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch { /* error shown by parent */ }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1">
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <h2 className="text-sm font-semibold text-gray-800">{initial ? 'Edit Lesson' : 'New Lesson'}</h2>
        </div>
        <button onClick={submit} disabled={saving}
          className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Lesson'}
        </button>
      </div>

      {/* Body */}
      <form onSubmit={submit} className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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

          <Field label="Content">
            <RichEditor value={form.content} onChange={v => set('content', v)} />
          </Field>

        </div>
      </form>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('admin_token'));
  const [tab, setTab] = useState('Subjects');
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [modal, setModal] = useState(null); // { type, item? }

  const load = async () => {
    const [s, t, l] = await Promise.all([adminGetSubjects(), adminGetTopics(), adminGetLessons()]);
    setSubjects(Array.isArray(s.data) ? s.data : (s.data.results ?? []));
    setTopics(Array.isArray(t.data) ? t.data : (t.data.results ?? []));
    setLessons(Array.isArray(l.data) ? l.data : (l.data.results ?? []));
  };

  useEffect(() => { if (authed) load(); }, [authed]);

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;

  const closeModal = () => setModal(null);

  // ── CRUD handlers ──
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

  const diffColor = { Easy: 'text-green-600', Medium: 'text-yellow-600', Hard: 'text-red-600' };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
        <button onClick={() => { localStorage.removeItem('admin_token'); setAuthed(false); }}
          className="text-sm text-red-500 hover:underline">Logout</button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Subjects Tab ── */}
        {tab === 'Subjects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700">Subjects ({subjects.length})</h2>
              <button onClick={() => setModal({ type: 'subject' })} className={btn('bg-blue-600')}>+ New Subject</button>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Slug</th>
                    <th className="px-4 py-3 text-left">Icon</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subjects.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{s.title}</td>
                      <td className="px-4 py-3 text-gray-400">{s.slug}</td>
                      <td className="px-4 py-3 text-gray-400">{s.icon}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{s.description}</td>
                      <td className="px-4 py-3 flex gap-2 justify-end">
                        <button onClick={() => setModal({ type: 'subject', item: s })} className={btn('bg-yellow-500')}>Edit</button>
                        <button onClick={() => del('subject', s.id)} className={btn('bg-red-500')}>Delete</button>
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
              <h2 className="font-semibold text-gray-700">Topics ({topics.length})</h2>
              <button onClick={() => setModal({ type: 'topic' })} className={btn('bg-blue-600')}>+ New Topic</button>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Order</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topics.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{t.title}</td>
                      <td className="px-4 py-3 text-gray-500">{subjectName(t.subject)}</td>
                      <td className="px-4 py-3 text-gray-400">{t.order}</td>
                      <td className="px-4 py-3 flex gap-2 justify-end">
                        <button onClick={() => setModal({ type: 'topic', item: t })} className={btn('bg-yellow-500')}>Edit</button>
                        <button onClick={() => del('topic', t.id)} className={btn('bg-red-500')}>Delete</button>
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
              <h2 className="font-semibold text-gray-700">Lessons ({lessons.length})</h2>
              <button onClick={() => setModal({ type: 'lesson' })} className={btn('bg-blue-600')}>+ New Lesson</button>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Topic</th>
                    <th className="px-4 py-3 text-left">Difficulty</th>
                    <th className="px-4 py-3 text-left">Order</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lessons.map(l => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{l.title}</td>
                      <td className="px-4 py-3 text-gray-500">{topicName(l.topic)}</td>
                      <td className={`px-4 py-3 font-medium ${diffColor[l.difficulty]}`}>{l.difficulty}</td>
                      <td className="px-4 py-3 text-gray-400">{l.order}</td>
                      <td className="px-4 py-3 flex gap-2 justify-end">
                        <button onClick={() => setModal({ type: 'lesson', item: l })} className={btn('bg-yellow-500')}>Edit</button>
                        <button onClick={() => del('lesson', l.id)} className={btn('bg-red-500')}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
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
