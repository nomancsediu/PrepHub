from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_lesson_content_bn'),
    ]

    operations = [
        migrations.CreateModel(
            name='SiteVisit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.PositiveBigIntegerField(default=0)),
            ],
        ),
        migrations.AddField(
            model_name='lesson',
            name='likes',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
