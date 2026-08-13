export const GOVERNORATES: Record<string, string[]> = {
  Jerusalem: ['Jerusalem', 'Beit Hanina', 'Shuafat'],
  'Ramallah and Al-Bireh': ['Ramallah', 'Al-Bireh', 'Birzeit'],
  Nablus: ['Nablus', 'Huwwara', 'Beit Iba'],
  Hebron: ['Hebron', 'Halhul', 'Dura'],
  Bethlehem: ['Bethlehem', 'Beit Jala', 'Beit Sahour'],
  Jenin: ['Jenin', 'Qabatiya', 'Ya\'bad'],
  Tulkarm: ['Tulkarm', 'Anabta', 'Deir al-Ghusun'],
  Qalqilya: ['Qalqilya', 'Azzun', 'Jayyous'],
  Jericho: ['Jericho', 'Al-Auja', "Nabi Musa"],
  Gaza: ['Gaza City', 'Khan Yunis', 'Rafah'],
}

export const GOVERNORATE_NAMES = Object.keys(GOVERNORATES)
