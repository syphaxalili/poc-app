# API Chat IA - Résumé Structuré, Points Clés et Suggestions

## Route

**POST** `/api/chat/ask`

---

## Description
Permet à un utilisateur authentifié d'envoyer un fichier PDF à un modèle IA (Mistral-7B-Instruct-v0.2 via HuggingFace) pour obtenir :
- Un résumé structuré
- Des points clés
- Des suggestions d'actions

Le prompt utilisateur est optionnel et permet d'affiner la demande.

---

## Authentification
- **Type** : Bearer Token (JWT)
- **Obligatoire** : Oui

---

## Body (JSON)

| Champ      | Type   | Obligatoire | Description                                      |
|------------|--------|-------------|--------------------------------------------------|
| fileId     | String | Oui         | L'ID du fichier PDF uploadé                      |
| userPrompt | String | Non         | Prompt personnalisé pour le modèle IA (optionnel) |

**Exemple** :
```json
{
  "fileId": "65f1c2e4a1b2c3d4e5f6a7b8",
  "userPrompt": "Fais-moi un résumé structuré de ce document."
}
```

---

## Exemple d'utilisation avec Postman

1. Méthode : **POST**
2. URL : `http://localhost:5000/api/chat/ask`
3. Onglet **Authorization** :
   - Type : Bearer Token
   - Token : (votre JWT)
4. Onglet **Body** :
   - Type : raw, JSON
   - Collez l'exemple ci-dessus en adaptant l'ID du fichier

---

## Réponse en cas de succès (200)

```json
{
  "message": "Réponse générée avec succès",
  "chat": {
    "id": "65f1c2e4a1b2c3d4e5f6a7b8",
    "summary": "Résumé généré par l'IA...",
    "keyPoints": [
      "Point clé 1",
      "Point clé 2"
    ],
    "suggestions": [
      "Suggestion 1",
      "Suggestion 2"
    ]
  }
}
```

---

## Réponse en cas d'erreur

- **Fichier non trouvé** :
  ```json
  { "message": "Fichier non trouvé" }
  ```
- **Erreur HuggingFace/Mistral** :
  ```json
  { "message": "Erreur HuggingFace/Mistral", "error": "..." }
  ```
- **Erreur serveur** :
  ```json
  { "message": "Erreur lors du chat avec le modèle", "error": "..." }
  ```

---

## Exemple curl

```bash
curl -X POST http://localhost:5000/api/chat/ask \
  -H "Authorization: Bearer VOTRE_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "65f1c2e4a1b2c3d4e5f6a7b8",
    "userPrompt": "Fais-moi un résumé structuré de ce document."
  }'
```

---

## Résumé du flow

1. L'utilisateur s'authentifie et récupère un token JWT.
2. Il upload un PDF et récupère l'ID du fichier.
3. Il envoie une requête POST sur `/api/chat/ask` avec l'ID du fichier et (optionnellement) un prompt personnalisé.
4. Le serveur extrait le texte, interroge le modèle IA, enregistre et retourne le résumé, les points clés et les suggestions. 