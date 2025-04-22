from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Campaign(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title
    
class Quest(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class NPC(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    rolls = models.TextField(blank=True)
    stats = models.TextField(blank=True)

    def __str__(self):
        return self.name
    
class Encounter(models.Model):
    campaign = models.ForeignKey('Campaign', on_delete=models.CASCADE, related_name='encounters')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # Simple monster stat fields
    monster_name = models.CharField(max_length=100)
    monster_hp = models.IntegerField()
    monster_ac = models.IntegerField()
    monster_attack_bonus = models.IntegerField()
    monster_damage = models.CharField(max_length=50)

    # Track if it's completed
    is_completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({'Completed' if self.is_completed else 'Pending'})"