https://10.37.44.206:40010/vtom/public/domain/5.0/environments/PAY_TOURS/applications

[
  {
    "environment": "MyEnvironment",
    "name": "MyApplication",
    "comment": "A simple comment",
    "family": "string",
    "frequency": "Daily",
    "priority": {
      "enable": true,
      "value": 0
    },
    "execMode": "Job",
    "minStartTime": "00:00:00",
    "maxStartTime": "Unlimited",
    "cycle": {
      "enable": false,
      "value": "00:10:00"
    },
    "onDemand": false,
    "date": "MyDate",
    "submitUnit": "MySubmitUnit",
    "queue": "MyQueue",
    "user": "MyUser",
    "behaviourOnError": {
      "deschedule": true,
      "descheduleAt": "string"
    },
    "planning": {
      "calendar": "MyCalendar/2020",
      "useCalendarRules": true,
      "daysInWeek": {
        "monday": "Worked",
        "tuesday": "Worked",
        "wednesday": "Worked",
        "thursday": "Worked",
        "friday": "Worked",
        "saturday": "Worked",
        "sunday": "Worked"
      },
      "weeksInMonth": {
        "first": true,
        "second": true,
        "third": true,
        "fourth": true,
        "last": true
      },
      "monthsInYear": {
        "january": true,
        "february": true,
        "march": true,
        "april": true,
        "may": true,
        "june": true,
        "july": true,
        "august": true,
        "september": true,
        "october": true,
        "november": true,
        "december": true
      },
      "daysInMonth": {
        "1": "Worked",
        "2": "Worked",
        "3": "Worked",
        "4": "Worked",
        "5": "Worked",
        "6": "Worked",
        "7": "Worked",
        "8": "Worked",
        "9": "Worked",
        "10": "Worked",
        "11": "Worked",
        "12": "Worked",
        "13": "Worked",
        "14": "Worked",
        "15": "Worked",
        "16": "Worked",
        "17": "Worked",
        "18": "Worked",
        "19": "Worked",
        "20": "Worked",
        "21": "Worked",
        "22": "Worked",
        "23": "Worked",
        "24": "Worked",
        "25": "Worked",
        "26": "Worked",
        "27": "Worked",
        "28": "Worked",
        "29": "Worked",
        "30": "Worked",
        "31": "Worked"
      },
      "useFormula": false,
      "formula": [
        "string"
      ]
    },
    "expectedResources": [
      {
        "resource": "string",
        "operator": "string",
        "value": "string",
        "wait": true,
        "waitUntil": "string",
        "startAfterWait": true,
        "free": true
      }
    ],
    "instruction": "MyInstruction"
  }
]
