from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # ডিফল্ট অ্যাডমিন প্যানেল (আপনি এখান থেকেই ডাটা অ্যাড করবেন)
    path('admin/', admin.site.urls),
    
    # ভবিষ্যতে রিয়্যাক্ট অ্যাডমিন প্যানেল থেকে লগইন করার জন্য টোকেন নেওয়া
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # আমাদের বানানো সব API (Public + Admin CRUD)
    path('api/', include('core.urls')),
]