from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_adminuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='content_bn',
            field=models.TextField(blank=True, help_text='Bangla content (HTML)'),
        ),
    ]
