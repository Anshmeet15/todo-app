from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Todo


class TodoAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse('todo-list')
        self.todo = Todo.objects.create(title='Existing todo', description='desc')

    def detail_url(self, pk):
        return reverse('todo-detail', args=[pk])

    # ---------- CREATE ----------
    def test_create_todo(self):
        response = self.client.post(
            self.list_url,
            {'title': 'Buy milk', 'description': '2 liters'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Buy milk')
        self.assertFalse(response.data['completed'])
        self.assertEqual(Todo.objects.count(), 2)

    def test_create_todo_without_description(self):
        response = self.client.post(self.list_url, {'title': 'No description'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['description'], '')

    # ---------- READ ----------
    def test_list_todos(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_is_newest_first(self):
        Todo.objects.create(title='Newer todo')
        response = self.client.get(self.list_url)
        self.assertEqual(response.data[0]['title'], 'Newer todo')

    def test_retrieve_todo(self):
        response = self.client.get(self.detail_url(self.todo.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.todo.id)

    def test_retrieve_missing_todo_returns_404(self):
        response = self.client.get(self.detail_url(999999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ---------- UPDATE ----------
    def test_full_update_put(self):
        response = self.client.put(
            self.detail_url(self.todo.id),
            {'title': 'Updated', 'description': 'new desc', 'completed': True},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated')
        self.assertTrue(self.todo.completed)

    def test_patch_complete_then_undo(self):
        # mark completed
        response = self.client.patch(
            self.detail_url(self.todo.id), {'completed': True}, format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.completed)

        # undo back to pending
        response = self.client.patch(
            self.detail_url(self.todo.id), {'completed': False}, format='json',
        )
        self.todo.refresh_from_db()
        self.assertFalse(self.todo.completed)

    # ---------- DELETE ----------
    def test_delete_todo(self):
        response = self.client.delete(self.detail_url(self.todo.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Todo.objects.filter(id=self.todo.id).exists())

    # ---------- VALIDATION ----------
    def test_blank_title_rejected(self):
        response = self.client.post(self.list_url, {'title': '   '}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_missing_title_rejected(self):
        response = self.client.post(self.list_url, {'description': 'no title'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_too_long_title_rejected(self):
        response = self.client.post(self.list_url, {'title': 'x' * 201}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_read_only_fields_ignored(self):
        response = self.client.post(
            self.list_url, {'title': 'Read only', 'id': 12345}, format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(response.data['id'], 12345)
