load('api_file.js');

let Config = {
    _config: JSON.parse(File.read('config.json')),

    get: function(key) {
        return this._config[key] || null;
    },

    set: function(key, value) {
        this._config[key] = value;
        File.write(JSON.stringify(_config), 'config.json');
    }
};

function buildSchedule(schedule) {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let builtSchedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    };

    for (let i = 0; i < 7; i++) {
        let day = days[i];
        let daySchedule = schedule[day];

        builtSchedule[day][0] = {
            start: { hour: 0, minute: 0 },
            end: { hour: 24, minute: 00 },
            on: false
        }

        for (let a = 0; a < daySchedule.length; a++) {
            let end;

            if (a === daySchedule.length -1) {
                end = { hour: 24, minute: 00 };
            } else {
                end = { hour: daySchedule[a + 1].hour, minute: daySchedule[a + 1].minute}
            }

            builtSchedule[day][a + 1] = {
                start: { hour: daySchedule[a].hour, minute: daySchedule[a].minute },
                end: end,
                on: daySchedule[a].on
            }
        }
    }

    for (let i = 0; i < 7; i++) {
        let day = days[i];

        if (builtSchedule[day].length === 1) {
            continue;
        }

        let prevDay = days[i === 0 ? 6 : i - 1];
        let prevDaySchedule = builtSchedule[prevDay];
        let prevDayScheduleLastItem = prevDaySchedule[prevDaySchedule.length - 1];

        builtSchedule[day][0].end = builtSchedule[day][1].start;
        builtSchedule[day][0].on = prevDayScheduleLastItem.on;
    }

    Config._schedule = builtSchedule;
}

buildSchedule(Config._config.schedule);
