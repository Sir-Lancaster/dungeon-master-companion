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
    hp = models.IntegerField(default=10)
    ac = models.IntegerField(default=10)
    attack_bonus = models.IntegerField(default=0)
    damage = models.CharField(max_length=50, default='1d6')

    def __str__(self):
        return f"{self.name} (HP: {self.hp}, AC: {self.ac})"
    
class Encounter(models.Model):
    campaign = models.ForeignKey('Campaign', on_delete=models.CASCADE, related_name='encounters')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({'Completed' if self.is_completed else 'Pending'})"

class Monster(models.Model):
    encounter = models.ForeignKey(Encounter, on_delete=models.CASCADE, related_name='monsters')
    name = models.CharField(max_length=100)
    hp = models.IntegerField()
    ac = models.IntegerField()
    attack_bonus = models.IntegerField()
    damage = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} (HP: {self.hp}, AC: {self.ac})"
