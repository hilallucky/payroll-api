const moment = require("moment");

summarizeEmployeeTimes = (data, calculatedTime) => {
    const employeeTotals = {};
    let grandTotalDuration = moment.duration(0);

    // Process each time entry
    data.forEach((entry) => {
        const [hours, minutes, seconds] = entry[calculatedTime]
            .split(":")
            .map(Number);
        const duration = moment.duration({ hours, minutes, seconds });

        // Add to employee subtotal
        if (!employeeTotals[entry.employeeId]) {
            employeeTotals[entry.employeeId] = moment.duration(0);
        }
        employeeTotals[entry.employeeId].add(duration);

        // Add to grand total
        grandTotalDuration.add(duration);
    });

    const formatDuration = (duration) => {
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(2, "0")}`;
    };
    // Convert employee totals to formatted strings
    const formattedEmployeeTotals = Object.entries(employeeTotals).map(
        ([employeeId, duration]) => ({
            employeeId: parseInt(employeeId),
            totalHours: formatDuration(duration),
        })
    );

    return {
        grandTotal: formatDuration(grandTotalDuration),
        employeeTotals: formattedEmployeeTotals,
    };
};

module.exports = summarizeEmployeeTimes;
