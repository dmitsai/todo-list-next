'use client';

import {
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Todo } from '~/shared/lib/types/todo';
import { v4 as uuid } from 'uuid';
import { useTodoContext } from '~/shared/lib/context/TodoContext';
import AddIcon from '@mui/icons-material/Add';
import { zodResolver } from '@hookform/resolvers/zod';
import { creatorFormSchema } from '../model/schema';
import { useEffect } from 'react';
import theme from '~/styles/theme';

export interface TodoCreatorForm {
  creator: string;
}

export const TodoCreator: React.FC = () => {
  const { create } = useTodoContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(creatorFormSchema),
    defaultValues: {
      creator: '',
    },
  });

  const onSubmit = (data: TodoCreatorForm) => {
    const currentDate = new Date();

    const newTodo: Todo = {
      id: uuid(),
      date: currentDate.toISOString(),
      status: 'OPEN',
      task: data.creator,
    };

    create(newTodo);
    reset();
  };

  useEffect(() => {
    if (!!errors.creator) console.error('[Error]:', errors.creator?.message);
  }, [errors.creator]);

  return (
    <Card
      variant={'outlined'}
      sx={{
        position: 'relative',
        borderRadius: 2,
        width: '100%',
        overflow: 'visible',
        ...(errors.creator && {
          borderColor: 'error.main',
          boxShadow: (theme) => `0 0 2px ${theme.palette.error.main}`,
        }),
      }}
    >
      <CardContent
        onSubmit={handleSubmit(onSubmit)}
        component={'form'}
        sx={{
          p: 1,
          '&:last-child': {
            pb: 1,
          },
        }}
      >
        <TextField
          variant="outlined"
          label="Создать задание"
          size="small"
          fullWidth
          autoComplete="off"
          slotProps={{
            input: {
              sx: {
                fontSize: '14px',
                height: '36px',
                alignItems: 'center',
                paddingRight: '40px',
              },
            },
            inputLabel: {
              sx: {
                top: '50%',
                left: 14,
                fontSize: '14px',
                transform: 'translate(0, -50%)',
                opacity: !isDirty ? 1 : 0,
                transition: 'all 0.2s',
                color: !!errors.creator
                  ? theme.palette.error.main
                  : theme.palette.text.secondary,
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
          {...register('creator')}
        />
        <IconButton
          type="submit"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            opacity: isDirty ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        {!!errors.creator && (
          <Typography
            sx={{
              userSelect: 'none',
              fontSize: '12px',
              position: 'absolute',
              color: theme.palette.error.main,
              bottom: -25,
              left: 0,
            }}
          >
            {errors.creator.message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
