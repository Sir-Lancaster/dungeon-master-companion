"""
URL configuration for dmCompanion project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from campaigns.views import login_view, logout_view, register_view, dashboard, create_campaign, update_campaign, delete_campaign, get_campaign

urlpatterns = [
    path('', dashboard, name='home'),  # Root URL points to the dashboard
    path('api/login/', login_view, name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/register/', register_view, name='register'),
    path('api/dashboard/', dashboard, name='dashboard'),
    path('api/create_campaign/', create_campaign, name='create_campaign'),
    path('api/campaigns/update/<int:campaign_id>/', update_campaign, name='update_campaign'),
    path('api/campaigns/delete/<int:campaign_id>/', delete_campaign, name='delete_campaign'),
    path('api/campaigns/<int:campaign_id>/', get_campaign, name='campaign_detail'),
]
