from fastapi import status
import pytest


@pytest.mark.asyncio
async def test_add_idea_success(client, registered_user):
    """Test adding an idea successfully"""
    user, headers = registered_user

    payload = {
        "name": "High-End Gaming Headset",
        "category": ["Family", "Gaming", "Fun"],
    }

    response = await client.post("/ideas", headers=headers, json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert data["title"]["name"] == "High-End Gaming Headset"
    assert data["title"]["category"] == ["Family", "Gaming", "Fun"]
    assert "created_at" in data
    assert "history_id" in data


@pytest.mark.asyncio
async def test_get_idea_success(client, create_user_and_idea):
    """Test retrieving ideas successfully"""
    user, headers, idea = create_user_and_idea

    response = await client.get("/ideas", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert data[0]["title"]["name"] == idea.title["name"]
    assert data[0]["title"]["category"] == idea.title["category"]


@pytest.mark.asyncio
async def test_add_idea_missing_name(client, registered_user):
    """Test adding an idea without the required 'name' field"""
    user, headers = registered_user

    payload = {
        "category": ["Family", "Gaming"],
    }

    response = await client.post("/ideas", headers=headers, json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


@pytest.mark.asyncio
async def test_add_idea_invalid_category(client, registered_user):
    """Test adding an idea with invalid category format"""
    user, headers = registered_user

    payload = {
        "name": "Test Idea",
        "category": "InvalidCategory",  # Should be a list
    }

    response = await client.post("/ideas", headers=headers, json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


@pytest.mark.asyncio
async def test_add_idea_unauthorized(client):
    """Test adding an idea without authentication"""
    payload = {
        "name": "High-End Gaming Headset",
        "category": ["Family", "Gaming", "Fun"],
    }

    response = await client.post("/ideas", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_get_ideas_empty_list(client, registered_user):
    """Test retrieving ideas when user has no ideas"""
    user, headers = registered_user

    response = await client.get("/ideas", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


@pytest.mark.asyncio
async def test_get_idea_by_id_success(client, create_user_and_idea):
    """Test retrieving a specific idea by its ID"""
    user, headers, idea = create_user_and_idea

    response = await client.get(f"/ideas/{idea.id}", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == idea.id
    assert data["title"]["name"] == idea.title["name"]
