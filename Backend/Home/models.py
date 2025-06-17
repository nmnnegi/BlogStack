from django.db import models
from django.utils.text import slugify

# Create your models here.
class Blog(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.CharField(max_length=250)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    tags = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            unique_slug = base_slug
            number = 1
            while Blog.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{number}"
                number += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

        


    
