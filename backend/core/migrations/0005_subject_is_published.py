from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_sitevisit_lesson_likes'),
    ]

    operations = [
        migrations.AddField(
            model_name='subject',
            name='is_published',
            field=models.BooleanField(default=True),
        ),
    ]
