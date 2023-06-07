from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from .serializers import UserSerializer, ConversationSerializer, MessageSerializer, UserCreationSerializer
from .models import Conversation, User


def user(request):
    return HttpResponse("Work")


class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserDetailView(RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        user = self.request.user
        return user


class UserProfileView(RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)
        return user

# def user_detail(request, pk):
#     try:
#         user = User.objects.get(pk=pk)
#         data = {
#             'name': user.name,
#             "username": user.username,
#             'email': user.email,
#             # Add other fields as necessary
#         }
#         return Response(data)
#     except User.DoesNotExist:
#         return Response({'error': 'User not found'}, status=404)


class CreateUserView(CreateAPIView):
    serializer_class = UserCreationSerializer


class ConversationList(ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the current user's conversations
        user = self.request.user
        conversations = Conversation.objects.filter(participants=user)

        # Prefetch related user data to avoid extra database queries
        conversations = conversations.prefetch_related('participants')

        return conversations


# User Search View
class UserSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('query')
        if not query:
            return Response({'error': 'Please provide a search query.'}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(username__icontains=query)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class CreateConversation(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        participant_id = request.data.get('id')

        if not participant_id:
            return Response({'error': 'Please provide a participant_id.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            participant = User.objects.get(id=participant_id)
        except User.DoesNotExist:
            return Response({'error': 'Participant does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if conversation with the same participants already exists
        conversation_exists = Conversation.objects.filter(
            participants=user).filter(participants=participant).exists()
        if conversation_exists:
            return Response({'error': 'Conversation with the same participants already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        conversation = Conversation.objects.create()
        conversation.participants.add(user, participant)

        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ConversationDetail(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, conversation_id):

        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

        conversation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MessageList(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        #     if not request.user.is_authenticated:
        #         return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

        messages = conversation.messages.all()
        # serializer = MessageSerializer(messages, many=True)
        message_list = []
        for message in messages:
            data = {
                "id": message.id,
                "conversation": message.conversation.id,
                "content": message.content,
                "sender": message.sender.id,
                "sender_name": message.sender.name,
            }
            message_list.append(data)

        return Response(message_list, status=status.HTTP_200_OK)

    def post(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        data['conversation'] = conversation.id

        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendMessage(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        recipient = conversation.participants.exclude(id=user.id).first()
        if not recipient:
            return Response({'error': 'Recipient not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        data['conversation'] = conversation.id
        data['sender'] = user.id
        data['recipient'] = recipient.id

        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            resp_data = serializer.data
            resp_data["recipient_id"] = recipient.id
            return Response(resp_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
