export const formatDate = (inputDate: string) => {
  const date = new Date(inputDate);
  const currentDate = new Date();

  const diffInSeconds = Math.floor(
    (currentDate.getTime() - date.getTime()) / 1000
  );

  if (diffInSeconds < 59) {
    return 'Только что';
  }

  if (diffInSeconds < 90) {
    return 'Минуту назад';
  }

  if (diffInSeconds < 300) {
    return '5 минут назад';
  }

  const todayWithoutTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const dateWithoutTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (dateWithoutTime.getTime() === todayWithoutTime.getTime()) {
    return 'Сегодня';
  }

  const yesterday = new Date(todayWithoutTime);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateWithoutTime.getTime() === yesterday.getTime()) {
    return 'Вчера';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
