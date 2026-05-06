from unittest.mock import patch
from fastapi import status
import pytest
import pytest


@pytest.mark.asyncio
async def test_add_history_success(client, create_poll_and_user):
    """Test adding a suggestion/history successfully with mocked AI response"""
    user, headers, poll = create_poll_and_user

    payload = {
        "event_type": "Birthday",
        "recipient_relation": "Family",
        "recipient_age": 25,
        "recipient_hobbies": "Music",
        "gift_type": "Fun",
        "budget_range": 100,
    }

    # Mock the AI suggestion service response
    mock_suggestions = [
        {"name": "Portable Bluetooth Speaker", "category": ["Family", "Music", "Fun"]},
        {"name": "Concert Tickets", "category": ["Family", "Music", "Fun"]},
        {"name": "Vinyl Record Player", "category": ["Family", "Music", "Fun"]},
        {
            "name": "Subscription to a Music Streaming Service",
            "category": ["Family", "Music", "Fun"],
        },
        {"name": "Karaoke Machine", "category": ["Family", "Music", "Fun"]},
    ]

    with patch("app.api.routes.suggestion.ai_prompt") as mock_generate:
        mock_generate.return_value = mock_suggestions

        response = await client.post(
            f"/polls/{poll.uuid}/products/suggestion", headers=headers, json=payload
        )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 5
    assert data[0]["name"] == "Portable Bluetooth Speaker"
    assert data[0]["category"] == ["Family", "Music", "Fun"]


@pytest.mark.asyncio
async def test_add_history_with_partial_mock(client, create_poll_and_user):
    """Test adding suggestion with only AI service mocked"""
    user, headers, poll = create_poll_and_user

    payload = {
        "event_type": "Birthday",
        "recipient_relation": "Family",
        "recipient_age": 25,
        "recipient_hobbies": "Music",
        "gift_type": "Fun",
        "budget_range": 100,
    }

    mock_suggestions = [
        {"name": "Portable Bluetooth Speaker", "category": ["Family", "Music", "Fun"]},
        {"name": "Concert Tickets", "category": ["Family", "Music", "Fun"]},
    ]

    with patch("app.api.routes.suggestion.ai_prompt", return_value=mock_suggestions):
        response = await client.post(
            f"/polls/{poll.uuid}/products/suggestion", headers=headers, json=payload
        )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 2
    assert all("name" in item and "category" in item for item in data)


@pytest.mark.asyncio
async def test_add_history_unauthorized(client, create_poll_and_user):
    """Test adding suggestions without authentication"""
    user, headers, poll = create_poll_and_user

    payload = {
        "event_type": "Birthday",
        "recipient_relation": "Family",
        "recipient_age": 25,
        "recipient_hobbies": "Music",
        "gift_type": "Fun",
        "budget_range": 100,
    }

    response = await client.post(
        f"/polls/{poll.uuid}/products/suggestion", json=payload
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_add_history_missing_required_fields(client, create_poll_and_user):
    """Test adding suggestions with missing required payload fields"""
    user, headers, poll = create_poll_and_user

    payload = {
        "event_type": "Birthday",
        # Missing other required fields
    }

    response = await client.post(
        f"/polls/{poll.uuid}/products/suggestion", headers=headers, json=payload
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
