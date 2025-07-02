import { Typography, List, ListItem, ListItemText } from "@mui/material";

export default function History({ documents = [] }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Historique de vos documents
      </Typography>
      {documents.length > 0 ? (
        <List>
          {documents.map((doc, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={doc.name} secondary={doc.date} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2">
          Aucun document analysé pour le moment.
        </Typography>
      )}
    </>
  );
}
