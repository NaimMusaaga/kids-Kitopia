const db = require('../config/db');

// يقبل عمراً صحيحاً بين 1 و17، وإلا يرجع null
const parseAge = (value) => {
    const n = Number.parseInt(value, 10);
    return Number.isInteger(n) && n >= 1 && n <= 17 ? n : null;
};

// يحول عمر الطفل إلى رقم الفئة العمرية (الأكبر من الحد الأعلى يُعامل كأكبر فئة)
const ageGroupIdFor = async (age) => {
    const [groups] = await db.execute('SELECT id, min_age, max_age FROM agegroups ORDER BY min_age');
    if (groups.length === 0) return null;
    const match = groups.find((g) => age >= g.min_age && age <= g.max_age);
    if (match) return match.id;
    return age > groups[groups.length - 1].max_age ? groups[groups.length - 1].id : groups[0].id;
};

module.exports = { parseAge, ageGroupIdFor };
