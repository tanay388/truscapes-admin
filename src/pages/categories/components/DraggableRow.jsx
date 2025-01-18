import { useRef } from "react";
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useDrag, useDrop } from "react-dnd";

const DraggableRow = ({
  category,
  index,
  moveCategory,
  handleOpenDialog,
  handleDelete,
}) => {
  const theme = useTheme();
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "CATEGORY",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveCategory(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "CATEGORY",
    item: () => ({ id: category.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <TableRow
      ref={ref}
      style={{ opacity }}
      sx={{
        cursor: "move",
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.05),
        },
      }}
      data-handler-id={handlerId}
    >
      <TableCell padding="checkbox">
        <DragIcon color="action" />
      </TableCell>
      <TableCell>
        {category.image ? (
          <Box
            component="img"
            sx={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 1,
              boxShadow: 1,
            }}
            src={category.image}
            alt={category.name}
          />
        ) : (
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon color="primary" />
          </Box>
        )}
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" fontWeight={600}>
          {category.name}
        </Typography>
      </TableCell>
      <TableCell>{category.description}</TableCell>
      <TableCell>
        {category.parent?.name ? (
          <Chip
            label={category.parent.name}
            size="small"
            variant="outlined"
            color="primary"
          />
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => handleOpenDialog(category)}
              size="small"
              sx={{
                color: theme.palette.primary.main,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDelete(category.id)}
              size="small"
              sx={{
                color: theme.palette.error.main,
                "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default DraggableRow;