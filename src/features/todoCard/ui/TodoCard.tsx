'use client';

import {
  Button,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { formatDate } from '~/shared/lib/utils/formatDate';
import styles from './todoCard.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useForm } from 'react-hook-form';
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import theme from '~/styles/theme';
import { Todo } from '~/shared/lib/types/todo';
import { useTodoContext } from '~/shared/lib/context/TodoContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoCardFormSchema } from '../model/schema';

export interface TodoForm {
  status: boolean;
  task: string;
}

export interface TodoCardProps {
  todo: Todo;
}

export const TodoCard: React.FC<TodoCardProps> = memo(({ todo }) => {
  const { remove, updateStatus, updateTask } = useTodoContext();
  const { id, date, task, status } = useMemo(() => todo, [todo]);

  const formatedDate = formatDate(date);

  const {
    register,
    setFocus,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TodoForm>({
    resolver: zodResolver(todoCardFormSchema),
    defaultValues: {
      status: status === 'DONE',
      task: task,
    },
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      isValid &&
      cardRef.current &&
      !cardRef.current.contains(event.target as Node)
    ) {
      setIsEditMode(false);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    setIsEditMode(true);
    setFocus('task');
  };

  useEffect(() => {
    if (isEditMode) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditMode]);

  const onSubmit = (data: TodoForm) => {
    if (isValid) {
      updateTask(id, data.task);
      setIsEditMode(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const getCardBorderColor = () => {
    if (!isValid && !!errors.task) return theme.palette.error.main;
    if (isEditMode) return theme.palette.primary.main;
    return theme.palette.background.default;
  };

  useEffect(() => {
    if (!!errors.task) console.error('[Error]:', errors.task?.message);
  }, [errors.task]);

  return (
    <Card
      onDoubleClick={handleDoubleClick}
      ref={cardRef}
      sx={{
        height: 'var(--card-height)',
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        borderRadius: 4,
        border: '1px solid',
        borderColor: getCardBorderColor(),
        transition: 'all 0.4s',
      }}
    >
      <CardContent
        component={'form'}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, userSelect: 'none' }}>
          {formatedDate}
        </Typography>
        <div className={styles.content}>
          {!!errors.task && (
            <Typography
              sx={{
                userSelect: 'none',
                fontSize: '12px',
                position: 'absolute',
                bottom: -25,
                left: 50,
                color: theme.palette.error.main,
              }}
            >
              {errors.task.message}
            </Typography>
          )}
          <Checkbox
            checked={status === 'DONE'}
            {...register('status')}
            onChange={(e) => {
              updateStatus(id, e.target.checked ? 'DONE' : 'OPEN');
            }}
          />
          <TextField
            autoComplete="off"
            onKeyDown={handleKeyDown}
            fullWidth
            sx={{
              paddingRight: 2,
              '& .MuiInputBase-root': {
                '& .Mui-disabled': {
                  WebkitTextFillColor: theme.palette.text.primary,
                },
              },
              '& .MuiInput-underline': {
                '&:before': {
                  borderBottom: '0px solid ',
                },
                '&:after': {
                  borderBottom: `2px solid ${isValid ? theme.palette.primary.main : theme.palette.error.main}`,
                  transform: !isEditMode ? 'scaleX(0)' : 'scaleX(1)',
                  transition: theme.transitions.create('all', {
                    duration: theme.transitions.duration.standard,
                    easing: theme.transitions.easing.easeOut,
                  }),
                },
              },
            }}
            disabled={!isEditMode}
            variant="standard"
            {...register('task')}
          />
        </div>
        <div className={styles.cardFooter}>
          <IconButton
            size="small"
            onClick={() => {
              remove(id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setIsEditMode(true);
              setTimeout(() => setFocus('task'), 10);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <Button
            disabled={!isValid}
            type={'submit'}
            sx={{
              visibility: isEditMode ? 'visible' : 'hidden',
              opacity: isEditMode ? 1 : 0,
              position: 'absolute',
              width: 'fit-content',
              paddingX: '0.5rem',
              paddingY: '0.25rem',
              right: '4rem',
              transform: isEditMode ? 'translateX(0)' : 'translateX(30%)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: theme.transitions.create(['transform', 'opacity'], {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeOut,
              }),
            }}
          >
            {'Сохранить'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
