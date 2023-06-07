from django.urls import path
from .views import *

urlpatterns = [
    # path("user", user),
    path('login/', UserLoginView.as_view(), name='login'),
    path('register/', CreateUserView.as_view(), name='registerr'),
    path('detail/', UserDetailView.as_view(), name='user-detail'),
    path('profile/<int:user_id>/', UserProfileView.as_view(), name='user-profile'),
    path('search/', UserSearchView.as_view(), name='user_search'),
    path("conversations/", ConversationList.as_view(), name="messages"),
    path('conversations/create/', CreateConversation.as_view(),
         name='create-conversation'),
    path('conversations/<int:conversation_id>/',
         ConversationDetail.as_view(), name='conversation-detail'),
    path('conversations/<int:conversation_id>/messages/',
         MessageList.as_view(), name='message-list'),
    path('conversations/<int:conversation_id>/send/',
         SendMessage.as_view(), name='send-message'),
]
