import { useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, TextField } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

const DatePickerBtn = ({ handleSelectDate }) => {
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
              backgroundColor: "#ffc247",
            },
            "&.Mui-selected": {
              backgroundColor: "#ffc247",
              color: "#000",
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
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffc247",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#EBECEC",
            },
          },
          input: {
            color: "#000",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            color: "#fff",
            border: "1px solid #fff",
            borderRadius: "16px",
            backgroundColor: "#25283d",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#ffc247",
          },
          textPrimary: {
            color: "#ffc247",
          },
          textSecondary: {
            color: "#ffc247",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "#ffc247",
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
          renderInput={(params) => <TextField {...params} />}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default DatePickerBtn;
