from typing import List
import pytest
import os
import requests
from tests.mutations import *
import datetime

DATABASE_URL = os.getenv('DATABASE_URL')
HASURA_GRAPHQL_URL=os.getenv('HASURA_GRAPHQL_URL')
EXPRESS_EVENTS_URL = os.getenv('EXPRESS_EVENTS_URL')

mutation = """
mutation ClearDB {
  
  delete_domain_events(where: {}) {
    affected_rows
  }
  
  delete_info_notifications(where: {}) {
    affected_rows
  }
  
  delete_notifications(where: {}) {
    affected_rows
  }
  
  delete_event_files(where: {}) {
    affected_rows
  }
  
  delete_event_files(where: {}) {
    affected_rows
  }
  
  delete_event_attendees(where: {}) {
    affected_rows
  }
    
  delete_event_teams(where: {}) {
    affected_rows
  }
  
  delete_users(where: {}) {
    affected_rows
  }
  
    delete_events(where: {}) {
    affected_rows
  }
}
"""
@pytest.fixture(scope='session')
def hasura_url():
    return HASURA_GRAPHQL_URL

@pytest.fixture(scope='session')
def express_url():
    return EXPRESS_EVENTS_URL

def create_user_headers(userId: str):
    return {
        'X-Hasura-User-Id': userId
    }

@pytest.fixture(scope='session')
def session():
    session = requests.session()
    yield session
    session.close()

@pytest.fixture(scope='session')
def reset_db(session: requests.Session, hasura_url):
    body = {
        'query': mutation
    }
    session.post(url=hasura_url, json=body)

@pytest.fixture(autouse=True)
def teardown(session: requests.Session, hasura_url):
    yield
    body = {
        'query': mutation
    }
    session.post(url=hasura_url, json=body)

@pytest.fixture
def create_user(session: requests.Session, hasura_url):
    def _create_user(id: str, firstName: str, lastName: str, username: str, college: str):
        input = {
            'firstName': firstName,
            'lastName': lastName,
            'username': username,
            'college': college
        }
        body = {
            'query': createUserMutation,
            'variables': {
                'input': input
            }
        }
        resp = session.post(url=hasura_url, json=body, headers={
            'X-Hasura-User-Id': id
        })
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body
        status = resp_body['data']['createUser']['status']
        reason = resp_body['data']['createUser']['reason']
        assert status == 'SUCCESS', f'creating user failed with reason: {reason}'
        return resp_body['data']['createUser']['id']
    return _create_user

@pytest.fixture
def create_event(session: requests.Session, hasura_url):
    def _create_event(ownerId: str, name: str, info: str, capacity: int, startDate: str, type: str, status: str):
        input = {
            'name': name,
            'info': info,
            'capacity': capacity,
            'startDate': startDate,
            'type': type,
            'status': status
        }
        body = {
            'query': createEventMutation,
            'variables': {
                'input': input
            }
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(ownerId), json=body)
        assert resp.status_code == 200, f'creating event responded with status {resp.status_code}'
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when creating event'
        assert resp_body['data']['createEvent']['status'] == 'SUCCESS'
        return resp_body['data']['createEvent']['id']

    return _create_event

@pytest.fixture
def invite_user_to_event(session: requests.Session, hasura_url):
    def _invite_user_to_event(senderId: str, eventId: int, userId: str):
        variables = {
            'userId': userId,
            'eventId': eventId
        }
        body = {
            'query': inviteUserToEvent,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(senderId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when inviting user to event'
        assert resp_body['data']['inviteUserToEvent']['status'] == 'SUCCESS', f'error when inviting user to event: {resp.reason}'

    return _invite_user_to_event

@pytest.fixture
def accept_event_invitation(session: requests.Session, hasura_url):
    def _accept_event_invitation(userId: str, eventId: int):
        variables = {
            'eventId': eventId
        }
        body = {
            'query': acceptEventInvitationMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when inviting user to event'
        assert resp_body['data']['acceptEventInvitation']['status'] == 'SUCCESS', f'error when accepting event invitation: {resp.reason}'
    
    return _accept_event_invitation

@pytest.fixture
def decline_event_invitation(session: requests.Session, hasura_url):
    def _decline_event_invitation(userId: str, eventId: int):
        variables = {
            'eventId': eventId
        }
        body = {
            'query': declineEventInvitationMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when inviting user to event'
        print(resp_body)
        assert resp_body['data']['declineEventInvitation']['status'] == 'SUCCESS', f'error when declining event invitation: {resp.reason}'
    
    return _decline_event_invitation

@pytest.fixture
def cancel_event_invitation(session: requests.Session, hasura_url):
    def _cancel_event_invitation(senderId: str, userId: str, eventId: int):
        variables = {
            'eventId': eventId,
            'userId': userId
        }
        body = {
            'query': cancelEventInvitationMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(senderId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when cancelling event invitation'
        data = resp_body['data']['cancelEventInvitation']
        assert data['status'] == 'SUCCESS', f'error when cancelling event invitation: {data["reason"]}'
    
    return _cancel_event_invitation

@pytest.fixture
def delete_event(session: requests.Session, hasura_url):
    def _delete_event(ownerId: str, eventId: int):
        variables = {
            'eventId': eventId
        }
        body = {
            'query': deleteEventMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(ownerId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when deleting event'
        assert resp_body['data']['deleteEvent']['status'] == 'SUCCESS', f'error when deleting event: {resp.reason}'
    
    return _delete_event

@pytest.fixture
def join_event(session: requests.Session, hasura_url):
    def _join_event(eventId: int, userId: str):
        variables = {
            'eventId': eventId,
        }
        body = {
            'query': joinEventMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when joining event'
        assert resp_body['data']['joinEvent']['status'] == 'SUCCESS', f'error when joining event: {resp.reason}'
    
    return _join_event

@pytest.fixture
def leave_event(session: requests.Session, hasura_url):
    def _leave_event(eventId: int, userId: str):
        variables = {
            'eventId': eventId,
        }
        body = {
            'query': leaveEventMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when joining event'
        assert resp_body['data']['leaveEvent']['status'] == 'SUCCESS', f'error when joining event: {resp.reason}'
    
    return _leave_event

@pytest.fixture
def delete_event(session: requests.Session, hasura_url):
    def _delete_event(eventId: int, userId: str):
        variables = {
            'eventId': eventId
        }
        body = {
            'query': deleteEventMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when deleting event'
        assert resp_body['data']['deleteEvent']['status'] == 'SUCCESS', f'error when deleting event: {resp.reason}'
    
    return _delete_event

@pytest.fixture
def send_friend_request(session: requests.Session, hasura_url):
    def _send_friend_request(userId: str, friendId: str):
        variables = {
            'friendId': friendId
        }
        body = {
            'query': sendFriendRequestMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when sending friend request'
        assert resp_body['data']['sendFriendRequest']['status'] == 'SUCCESS', f'error when sending friend request: {resp.reason}'

    return _send_friend_request

@pytest.fixture
def accept_friend_request(session: requests.Session, hasura_url):
    def _accept_friend_request(userId: str, friendId: str):
        variables = {
            'userId': friendId
        }
        body = {
            'query': acceptFriendRequestMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when accepting friend request'
        assert resp_body['data']['acceptFriendRequest']['status'] == 'SUCCESS', f'error when accepting friend request: {resp_body["data"]["acceptFriendRequest"]["reason"]}'

    return _accept_friend_request

@pytest.fixture
def reject_friend_request(session: requests.Session, hasura_url):
    def _reject_friend_request(userId: str, friendId: str):
        variables = {
            'userId': friendId
        }
        body = {
            'query': rejectFriendRequestMutation,
            'variables': variables
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when accepting friend request'
        assert resp_body['data']['rejectFriendRequest']['status'] == 'SUCCESS', f'error when rejecting friend request: {resp.reason}'

    return _reject_friend_request

@pytest.fixture
def remove_friend(session: requests.Session, hasura_url):
    def _remove_friend(userId: str, friendId: str):
        body = {
            'query': removeFriendMutation,
            'variables': {
                'userId': friendId
            }
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when removing friend'
        data = resp_body['data']['removeFriend']
        assert data['status'] == 'SUCCESS', f'error when removing friend request: {data["reason"]}'

    return _remove_friend

@pytest.fixture
def update_user(session: requests.Session, hasura_url):
    def _update_user(userId: str, input: dict):
        body = {
            'query': updateUser,
            'variables': {
                'input': input
            }
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when updating user'
        data = resp_body['data']['updateUser']
        assert data['status'] == 'SUCCESS', f'error when updating user: {data["reason"]}'

    return _update_user

@pytest.fixture
def start_event(session: requests.Session, express_url):
    def _start_event(eventId: int):
        body = {
            'payload': {
                'eventId': eventId
            }
        }
        resp = session.post(url=f'{express_url}/startEvent', json=body)
        assert resp.status_code == 200, f'starting event had status {resp.status_code}'
    return _start_event

@pytest.fixture
def end_event(session: requests.Session, hasura_url):
    def _end_event(userId: str, eventId: int, team1_members: List, team2_members: List, team1_scores: List, team2_scores: List, team1_win: bool):
        body = {
            'query': endEventMutation,
            'variables': {
                'eventId': eventId,
                'team1_members': team1_members,
                'team2_members': team2_members,
                'team1_scores': team1_scores,
                'team2_scores': team2_scores,
                'team1_win': team1_win
            }
        }
        resp = session.post(url=hasura_url, headers=create_user_headers(userId), json=body)
        assert resp.status_code == 200
        resp_body = resp.json()
        assert 'data' in resp_body, 'error when ending event'
        data = resp_body['data']['endEvent']
        assert data['status'] == 'SUCCESS', f'error when ending eventr: {data["reason"]}'

    return _end_event




