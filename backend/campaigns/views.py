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

# Campaign CRUD operations
def create_campaign(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        title = data.get('title')
        description = data.get('description')

        campaign = Campaign.objects.create(
            user=request.user,
            title=title,
            description=description
        )
        return JsonResponse({'message': 'Campaign created successfully!', 'campaign_id': campaign.id}, status=201)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def update_campaign(request, campaign_id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        title = data.get('title')
        description = data.get('description')

        try:
            campaign = Campaign.objects.get(id=campaign_id, user=request.user)
            campaign.title = title
            campaign.description = description
            campaign.save()
            return JsonResponse({'message': 'Campaign updated successfully!'}, status=200)
        except Campaign.DoesNotExist:
            return JsonResponse({'error': 'Campaign not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def delete_campaign(request, campaign_id):
    if request.method == 'DELETE':
        try:
            campaign = Campaign.objects.get(id=campaign_id, user=request.user)
            campaign.delete()
            return JsonResponse({'message': 'Campaign deleted successfully!'}, status=200)
        except Campaign.DoesNotExist:
            return JsonResponse({'error': 'Campaign not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def get_campaign(request, campaign_id):
    if request.method == 'GET':
        try:
            campaign = Campaign.objects.get(id=campaign_id, user=request.user)
            data = {
                'id': campaign.id,
                'title': campaign.title,
                'description': campaign.description,
            }
            return JsonResponse(data, status=200)
        except Campaign.DoesNotExist:
            return JsonResponse({'error': 'Campaign not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

# NPC CRUD operations
def create_npc(request, campaign_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        description = data.get('description')
        rolls = data.get('rolls', "")  # Provide a default value for rolls
        hp = data.get('hp', 10)
        ac = data.get('ac', 10)
        attack_bonus = data.get('attack_bonus', 0)
        damage = data.get('damage', '1d6')

        try:
            campaign = Campaign.objects.get(id=campaign_id, user=request.user)
            npc = NPC.objects.create(
                campaign=campaign,
                name=name,
                description=description,
                rolls=rolls,  # Include rolls here
                hp=hp,
                ac=ac,
                attack_bonus=attack_bonus,
                damage=damage
            )
            return JsonResponse({'message': 'NPC created successfully!', 'npc_id': npc.id}, status=201)
        except Campaign.DoesNotExist:
            return JsonResponse({'error': 'Campaign not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def update_npc(request, campaign_id, npc_id):
    if request.method == 'PUT':
        try:
            # Ensure the NPC belongs to the specified campaign and user
            npc = NPC.objects.get(id=npc_id, campaign__id=campaign_id, campaign__user=request.user)
            data = json.loads(request.body)

            # Update NPC fields
            npc.name = data.get('name', npc.name)
            npc.description = data.get('description', npc.description)
            npc.rolls = data.get('rolls', npc.rolls)
            npc.hp = data.get('hp', npc.hp)
            npc.ac = data.get('ac', npc.ac)
            npc.attack_bonus = data.get('attack_bonus', npc.attack_bonus)
            npc.damage = data.get('damage', npc.damage)
            npc.save()

            return JsonResponse({'message': 'NPC updated successfully!'}, status=200)
        except NPC.DoesNotExist:
            return JsonResponse({'error': 'NPC not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def delete_npc(request, campaign_id, npc_id):
    if request.method == 'DELETE':
        try:
            npc = NPC.objects.get(id=npc_id, campaign_id=campaign_id, campaign__user=request.user)
            npc.delete()
            return JsonResponse({'message': 'NPC deleted successfully!'}, status=200)
        except NPC.DoesNotExist:
            return JsonResponse({'error': 'NPC not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def get_npc(request, campaign_id, npc_id):
    if request.method == 'GET':
        try:
            npc = NPC.objects.get(id=npc_id, campaign__id=campaign_id, campaign__user=request.user)
            data = {
                'id': npc.id,
                'name': npc.name,
                'description': npc.description,
                'rolls': npc.rolls,
                'hp': npc.hp,
                'ac': npc.ac,
                'attack_bonus': npc.attack_bonus,
                'damage': npc.damage,
            }
            return JsonResponse(data, status=200)
        except NPC.DoesNotExist:
            return JsonResponse({'error': 'NPC not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def list_npcs(request, campaign_id):
    if request.method == 'GET':
        try:
            campaign = Campaign.objects.get(id=campaign_id, user=request.user)
            npcs = NPC.objects.filter(campaign=campaign).values('id', 'name', 'description')
            return JsonResponse(list(npcs), safe=False, status=200)
        except Campaign.DoesNotExist:
            return JsonResponse({'error': 'Campaign not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

# Encounter CRUD operations
def create_encounter(request, campaign_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        description = data.get('description')

        try:
            campaign = Campaign.objects.get(id=campaign_id, user=request.user)
            encounter = Encounter.objects.create(
                campaign=campaign,
                name=name,
                description=description
            )
            return JsonResponse({'message': 'Encounter created successfully!', 'encounter_id': encounter.id}, status=201)
        except Campaign.DoesNotExist:
            return JsonResponse({'error': 'Campaign not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def update_encounter(request, campaign_id, encounter_id):
    if request.method == 'PUT':
        try:
            encounter = Encounter.objects.get(id=encounter_id, campaign__id=campaign_id, campaign__user=request.user)
            data = json.loads(request.body)

            # Update encounter fields
            encounter.name = data.get('name', encounter.name)
            encounter.description = data.get('description', encounter.description)
            encounter.is_completed = data.get('is_completed', encounter.is_completed)
            encounter.save()

            return JsonResponse({'message': 'Encounter updated successfully!'}, status=200)
        except Encounter.DoesNotExist:
            return JsonResponse({'error': 'Encounter not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def delete_encounter(request, campaign_id, encounter_id):
    if request.method == 'DELETE':
        try:
            encounter = Encounter.objects.get(id=encounter_id, campaign__id=campaign_id, campaign__user=request.user)
            encounter.delete()
            return JsonResponse({'message': 'Encounter deleted successfully!'}, status=200)
        except Encounter.DoesNotExist:
            return JsonResponse({'error': 'Encounter not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def get_encounter(request, campaign_id, encounter_id):
    if request.method == 'GET':
        try:
            encounter = Encounter.objects.get(id=encounter_id, campaign__id=campaign_id, campaign__user=request.user)
            data = {
                'id': encounter.id,
                'name': encounter.name,
                'description': encounter.description,
                'is_completed': encounter.is_completed,
            }
            return JsonResponse(data, status=200)
        except Encounter.DoesNotExist:
            return JsonResponse({'error': 'Encounter not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)

def list_encounters(request, campaign_id):  
    if request.method == 'GET':
        try:
            campaign = Campaign.objects.get(id=campaign_id, user=request.user)
            encounters = Encounter.objects.filter(campaign=campaign).values('id', 'name', 'description', 'is_completed')
            return JsonResponse(list(encounters), safe=False, status=200)
        except Campaign.DoesNotExist:
            return JsonResponse({'error': 'Campaign not found'}, status=404)

    return JsonResponse({'message': 'Method not allowed!'}, status=405)