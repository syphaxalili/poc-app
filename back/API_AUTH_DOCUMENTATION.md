# API d'Authentification - Documentation

## Modèle User

Le modèle User a été mis à jour avec les champs suivants :
- `prenom` (String, requis) : Prénom de l'utilisateur
- `nom` (String, requis) : Nom de l'utilisateur
- `email` (String, requis, unique) : Email de l'utilisateur
- `password` (String, requis, min 6 caractères) : Mot de passe hashé
- `role` (Number, défaut: 0) : Rôle de l'utilisateur (0: utilisateur, 1: admin, 2: autre)
- `createdAt` et `updatedAt` : Timestamps automatiques

## Routes d'Authentification

### Routes Publiques

#### 1. Inscription - POST `/api/auth/register`
```json
{
  "prenom": "John",
  "nom": "Doe",
  "email": "john.doe@example.com",
  "password": "motdepasse123"
}
```

**Réponse réussie (201) :**
```json
{
  "message": "Inscription réussie",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "prenom": "John",
    "nom": "Doe",
    "email": "john.doe@example.com",
    "role": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Connexion - POST `/api/auth/login`
```json
{
  "email": "john.doe@example.com",
  "password": "motdepasse123"
}
```

**Réponse réussie (200) :**
```json
{
  "message": "Connexion réussie",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "prenom": "John",
    "nom": "Doe",
    "email": "john.doe@example.com",
    "role": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Déconnexion - POST `/api/auth/logout`
**Réponse (200) :**
```json
{
  "message": "Déconnecté avec succès"
}
```

### Routes Protégées (Nécessitent un token Bearer)

#### 4. Profil - GET `/api/auth/profile`
**Headers :**
```
Authorization: Bearer jwt_token_here
```

**Réponse réussie (200) :**
```json
{
  "message": "Profil récupéré avec succès",
  "user": {
    "id": "user_id",
    "prenom": "John",
    "nom": "Doe",
    "email": "john.doe@example.com",
    "role": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 5. Mise à jour du profil - PUT `/api/auth/profile`
**Headers :**
```
Authorization: Bearer jwt_token_here
```

**Body (tous les champs optionnels) :**
```json
{
  "prenom": "John Updated",
  "nom": "Doe Updated",
  "email": "john.updated@example.com"
}
```

**Réponse réussie (200) :**
```json
{
  "message": "Profil mis à jour avec succès",
  "user": {
    "id": "user_id",
    "prenom": "John Updated",
    "nom": "Doe Updated",
    "email": "john.updated@example.com",
    "role": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 6. Changer le mot de passe - PUT `/api/auth/change-password`
**Headers :**
```
Authorization: Bearer jwt_token_here
```

**Body :**
```json
{
  "currentPassword": "ancienmotdepasse",
  "newPassword": "nouveaumotdepasse"
}
```

**Réponse réussie (200) :**
```json
{
  "message": "Mot de passe changé avec succès"
}
```

#### 7. Supprimer le compte - DELETE `/api/auth/account`
**Headers :**
```
Authorization: Bearer jwt_token_here
```

**Réponse réussie (200) :**
```json
{
  "message": "Compte supprimé avec succès"
}
```

