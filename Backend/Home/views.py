from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Blog
from .serializers import BlogSerializer

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'author', 'tags']  # <-- for keyword search
