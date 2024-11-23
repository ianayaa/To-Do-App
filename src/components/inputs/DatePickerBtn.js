import { useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, TextField } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

const DatePickerBtn = ({ handleSelectDate, customIcon }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const elegantTheme = createTheme({
    palette: {
      primary: {
        main: "#ffc247",
      },
      secondary: {
        main: "#ffc247",
      },
      text: {
        primary: "#fff",
        secondary: "#ffc247",
      },
    },
    components: {
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            color: "#fff",
            borderRadius: "16px",
            backgroundColor: "#25283d",
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255, 194, 71, 0.2)",
            },
            "&.Mui-selected": {
              backgroundColor: "#ffc247",
              color: "#25283d",
              "&:hover": {
                backgroundColor: "#ffc247",
              },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            backgroundColor: "transparent",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffc247",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffc247",
            },
          },
          input: {
            color: "#fff",
            "&::placeholder": {
              color: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
            },
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            color: "#fff",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            color: "#fff",
            borderRadius: "16px",
            backgroundColor: "#25283d",
            "& .MuiPickersCalendarHeader-root": {
              color: "#fff",
              "& .MuiPickersCalendarHeader-label": {
                color: "#fff",
              },
              "& .MuiSvgIcon-root": {
                color: "#fff",
              },
            },
            "& .MuiDayCalendar-weekDayLabel": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiPickersYear-yearButton": {
              color: "#fff",
              "&.Mui-selected": {
                backgroundColor: "#ffc247",
                color: "#25283d",
              },
            },
            "& .MuiPickersMonth-monthButton": {
              color: "#fff",
              "&.Mui-selected": {
                backgroundColor: "#ffc247",
                color: "#25283d",
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#ffc247",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255, 194, 71, 0.1)",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#fff",
          },
        },
      },
      MuiPickersPopper: {
        styleOverrides: {
          paper: {
            backgroundColor: "#25283d",
            "& .MuiPickersCalendarHeader-root": {
              color: "#fff",
            },
          },
        },
      },
    },
  });

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    handleSelectDate(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={elegantTheme}>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                '& .MuiInputBase-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffc247',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffc247',
                  },
                },
                '& .MuiInputAdornment-root': {
                  color: '#fff',
                },
                '& .MuiSvgIcon-root': {
                  color: '#fff',
                },
              }
            },
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default DatePickerBtn;
