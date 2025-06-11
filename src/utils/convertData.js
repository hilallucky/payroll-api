const timeToHourstoMinutes = (timeStr) => {
    if (!timeStr || timeStr === "00:00:00") return 0;
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours + minutes / 60 + seconds / 3600;
};

module.exports = { timeToHourstoMinutes };
