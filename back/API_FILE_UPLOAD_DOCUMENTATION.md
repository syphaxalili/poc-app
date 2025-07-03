# API Upload de Fichier PDF - Documentation

## Route

**POST** `/api/file/upload`

---

## Description
Permet à un utilisateur authentifié d'uploader un fichier PDF. Le fichier est stocké sur le serveur et ses informations sont enregistrées en base de données.

---

## Authentification
- **Type** : Bearer Token (JWT)
- **Obligatoire** : Oui

---

## Body (form-data)

| Key  | Type | Description                |
|------|------|----------------------------|
| pdf  | File | Le fichier PDF à uploader  |

- **Le champ doit s'appeler exactement** : `pdf`
- **Seuls les fichiers PDF sont acceptés**. Si un autre type de fichier est envoyé, la réponse sera une erreur.

---

## Exemple d'utilisation avec Postman

1. Méthode : **POST**
2. URL : `http://localhost:5000/api/file/upload`
3. Onglet **Authorization** :
   - Type : Bearer Token
   - Token : (votre JWT)
4. Onglet **Body** :
   - Type : form-data
   - Key : `pdf` (type = File)
   - Value : (choisir un fichier PDF)

---

## Réponse en cas de succès (201)

```json
{
  "message": "Fichier uploadé avec succès",
  "file": {
    "id": "65f1c2e4a1b2c3d4e5f6a7b8",
    "filename": "1700000000000-billet.pdf",
    "originalname": "billet.pdf",
    "uploadedAt": "2024-03-01T12:34:56.789Z"
  }
}
```

---

## Réponse en cas d'erreur

- **Si le champ n'est pas un PDF** :
  ```json
  {
    "message": "Veuillez uploader un fichier PDF."
  }
  ```
- **Si aucun fichier n'est envoyé** :
  ```json
  {
    "message": "Aucun fichier envoyé"
  }
  ```
- **Si le champ s'appelle autrement que `pdf`** :
  ```json
  {
    "message": "Field name missing"
  }
  ```
- **Erreur serveur** :
  ```json
  {
    "message": "Erreur lors de l'upload",
    "error": "..."
  }
  ```

---

## Exemple curl

```bash
curl -X POST http://localhost:5000/api/file/upload \
  -H "Authorization: Bearer VOTRE_JWT" \
  -F "pdf=@/chemin/vers/votre/fichier.pdf"
```

---

## Résumé du flow

1. L'utilisateur s'authentifie et récupère un token JWT.
2. Il envoie une requête POST sur `/api/file/upload` avec le PDF dans le champ `pdf`.
3. Le serveur stocke le fichier et retourne les infos du fichier uploadé. 