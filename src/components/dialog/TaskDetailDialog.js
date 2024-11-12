import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Chip,
  Avatar,
  DialogActions,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faCalendarAlt,
  faFolderOpen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TaskDetailDialog = ({ open, handleClose, task }) => {
  const [user] = useAuthState(auth);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-slide-description"
      keepMounted
      className="task-dialog"
    >
      <DialogActions>
        <Button
          onClick={handleClose}
          startIcon={<FontAwesomeIcon icon={faXmark} />}
        />
      </DialogActions>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <div className={`statusIcon pending   `}>
            <FontAwesomeIcon icon={faFolderOpen} />
          </div>
          <Typography variant="h6" component="div">
            {task.titulo}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" className="content-wrapper">
          <Box flex={2} className="left-column">
            <Typography variant="body1">
              {task.descripcion || "No hay descripción"}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} my={2}>
              <FontAwesomeIcon
                icon={faPaperclip}
                style={{ color: "#ffc107" }}
              />
              <Button
                color="primary"
                variant="text"
                style={{ color: "#ffc107" }}
              >
                Adjuntar Archivo
              </Button>
            </Box>

            <TextField
              freeSolo
              fullWidth
              variant="outlined"
              placeholder="Comentar"
              className="comment-input"
              InputProps={{
                startAdornment: (
                  <Box display="flex" alignItems="center" mr={1}>
                    <Avatar
                      alt={user.displayName || "User"}
                      src={user.photoURL || ""}
                      sx={{ width: 50, height: 50, marginRight: 2 }}
                    />
                  </Box>
                ),
              }}
            />
          </Box>

          {/* Right Column: Task Actions */}
          <Box flex={1} className="right-column">
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Proyecto
              </Typography>
              <Typography variant="body1">#Tareas</Typography>
            </Box>
            <Divider />
            <Box my={2}>
              <Typography variant="body2" color="textSecondary">
                {task.dueDate
                  ? task.dueDate.toDate().toLocaleDateString()
                  : "Sin fecha"}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  style={{ color: "#ffc107" }}
                />
                <Typography variant="body1">
                  {task.dueDate
                    ? task.dueDate.toDate().toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Sin fecha"}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box my={2}>
              <Typography variant="body2" color="textSecondary">
                Prioridad
              </Typography>
              <Typography variant="body1">Media</Typography>
            </Box>
            <Divider />
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Etiquetas
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Chip label="Prioridad" size="small" color="success" />
                <Chip label="Matematicas" size="small" color="warning" />
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
