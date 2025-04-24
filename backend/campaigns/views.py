from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import Campaign, NPC, Quest, Encounter
import json

@csrf_exempt
def dashboard(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'User not authenticated'}, status=401)

    if request.method == 'GET':
        # Get all campaigns for the logged-in user
        campaigns = Campaign.objects.filter(user=request.user)
        campaign_data = []

        for campaign in campaigns:
            # Get related data for each campaign
            npcs = NPC.objects.filter(campaign=campaign).values('id', 'name', 'description')
            quests = Quest.objects.filter(campaign=campaign).values('id', 'title', 'description', 'completed')
            encounters = Encounter.objects.filter(campaign=campaign).values('id', 'name', 'description', 'is_completed')

            campaign_data.append({
                'id': campaign.id,
                'title': campaign.title,
                'description': campaign.description,
                'npcs': list(npcs),
                'quests': list(quests),
                'encounters': list(encounters),
            })

        # Return the dashboard data
        data = {
            'user': {
                'id': request.user.id,
                'username': request.user.username,
            },
            'campaigns': campaign_data,
        }
        return JsonResponse(data, status=200)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful!'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logout successful!'}, status=200)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(username=username, password=password)
        return JsonResponse({'message': 'Registration successful!'}, status=201)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)