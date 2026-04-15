from django.core.management.base import BaseCommand
from core.models import AdminUser


class Command(BaseCommand):
    help = 'Create an admin panel user'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str)
        parser.add_argument('password', type=str)

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        if AdminUser.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR(f'User "{username}" already exists.'))
            return
        user = AdminUser(username=username)
        user.set_password(password)
        user.save()
        self.stdout.write(self.style.SUCCESS(f'Admin user "{username}" created successfully.'))
