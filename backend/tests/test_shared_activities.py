from tests.conftest import TestSessionLocal
from fastapi import status
import pytest
from app.db.models import Activity


@pytest.mark.asyncio
async def test_get_shared_poll_success(client, registered_user, create_poll_and_user):
    """Test getting polls successfully"""
    user, headers = registered_user
    user2, headers2, shared_poll = create_poll_and_user

    db = TestSessionLocal()
    activity = Activity(user_id=user2.id, poll_id=shared_poll.id)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    db.close()

    response = await client.get("/activities", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert data[0]["title"] == shared_poll.title
    assert data[0]["budget"] == shared_poll.budget
    assert data[0]["uuid"] == str(shared_poll.uuid)
    assert "created_at" in data[0]


@pytest.mark.asyncio
async def test_add_shared_poll_success(client, registered_user, create_poll_and_user):
    """Test creating a poll successfully"""
    user, headers = registered_user
    user2, headers2, shared_poll = create_poll_and_user

    payload = {
        "uuid": str(shared_poll.uuid),
    }
    response = await client.post("/activities", headers=headers, json=payload)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert data["user_id"] == shared_poll.user_id
    assert data["poll_id"] == shared_poll.id
    assert "created_at" in data


@pytest.mark.asyncio
async def test_delete_activity_success(client, registered_user, create_poll_and_user):
    """Test deleting a shared poll from activities"""
    current_user, current_headers = registered_user
    other_user, other_headers, shared_poll = create_poll_and_user

    # Current user adds the shared poll first
    db = TestSessionLocal()
    activity = Activity(user_id=current_user.id, poll_id=shared_poll.id)
    db.add(activity)
    db.commit()
    db.close()

    response = await client.delete(
        f"/activities/{shared_poll.uuid}", headers=current_headers
    )

    assert response.status_code == status.HTTP_200_OK
