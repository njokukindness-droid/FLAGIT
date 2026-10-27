import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, AlignmentType, ShadingType,
  BorderStyle, VerticalAlign, HeightRule, TableLayoutType,
  convertInchesToTwip,
} from 'https://esm.sh/docx@8.5.0';

export const config = { path: '/api/daily-report' };

const mm = (v) => Math.round(v * 56.693); // mm to twips

const NAVY   = '004680';
const NAVY_BG = 'D6E4F0';
const WHITE  = 'FFFFFF';
const LGREY  = 'EEF2F6';

function noBorder() {
  const s = { style: BorderStyle.NONE, size: 0, color: 'auto' };
  return { top: s, bottom: s, left: s, right: s };
}

function thinBorder(color = '8CAFC8') {
  const s = { style: BorderStyle.SINGLE, size: 4, color };
  return { top: s, bottom: s, left: s, right: s };
}

function shade(fill) {
  return { fill, type: ShadingType.CLEAR, color: 'auto' };
}

function makeCell(text, opts = {}) {
  const {
    bold = false, size = 16, color = '1A1A1A', fill = WHITE,
    colSpan = 1, align = AlignmentType.LEFT,
    vAlign = VerticalAlign.CENTER, borders = thinBorder(),
    width = null,
  } = opts;

  const runs = Array.isArray(text)
    ? text.map(t => new TextRun({ text: String(t.text ?? ''), bold: t.bold ?? bold, size, color: t.color ?? color }))
    : [new TextRun({ text: String(text ?? ''), bold, size, color })];

  const cellOpts = {
    children: [new Paragraph({ children: runs, alignment: align })],
    shading: shade(fill),
    verticalAlign: vAlign,
    borders,
    columnSpan: colSpan,
    margins: { top: mm(1.2), bottom: mm(1.2), left: mm(1.5), right: mm(1.5) },
  };
  if (width) cellOpts.width = width;
  return new TableCell(cellOpts);
}

function lblCell(text, colSpan = 1) {
  return makeCell(text, { bold: true, size: 14, color: '1A3A5C', fill: NAVY_BG, colSpan, borders: thinBorder('8CAFC8') });
}

function valCell(text, colSpan = 1, bold = false) {
  return makeCell(text, { bold, size: 16, fill: WHITE, colSpan });
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body;
  try { body = await req.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  const {
    observations = [],
    projectName = '',
    orgName = '',
    location = '',
    dateStr = new Date().toISOString().slice(0, 10),
  } = body;

  const displayDate = new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const timeNow = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const preparedBy = 'Kindness Njoku';
  const submittedTo = 'Abass Afolabi';
  const orgDisplay = (orgName || projectName || 'TASETI').toUpperCase();

  // ── HAZARD CODES ─────────────────────────────────────────────────
  const HAZARDS = [
    ['A','Working at Heights'],['B','Ladders/Scaffold'],['C','Lifting Plant & Equip'],
    ['D','Mobile Plant & Vehicle'],['E','Hot Works'],['F','Portable Electrical Equip'],
    ['G','Power Tools/Machinery'],['H','Fire & Explosion'],['I','Chemicals'],
    ['J','Environmental Aspect'],['K','Access & Egress'],['L','Slips, Trips & Falls'],
    ['M','Manual Handling'],['N','Hand Tools'],['O','Excavation'],
    ['P','Emergency Equipment'],['Q','PPE'],['R','Confined Space'],['S','Others'],
  ];

  function hazardCell(code, label) {
    return new TableCell({
      children: [new Paragraph({
        children: [
          new TextRun({ text: code + '  ', bold: true, size: 13, color: NAVY }),
          new TextRun({ text: label, size: 13, color: '2A2A2A' }),
        ],
      })],
      shading: shade('F5F8FB'),
      borders: thinBorder('B0C8D8'),
      margins: { top: mm(0.8), bottom: mm(0.8), left: mm(1.2), right: mm(1.2) },
    });
  }

  // Row 1: A–J (10 items), Row 2: K–S (9 items) + 1 filler
  const hRow1 = HAZARDS.slice(0, 10);
  const hRow2 = HAZARDS.slice(10);

  const hazardTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        height: { value: mm(5), rule: HeightRule.ATLEAST },
        children: [new TableCell({
          columnSpan: 10,
          children: [new Paragraph({
            children: [new TextRun({ text: 'HAZARD CODE REFERENCE', bold: true, size: 15, color: WHITE })],
            alignment: AlignmentType.LEFT,
          })],
          shading: shade(NAVY), borders: thinBorder(WHITE),
          margins: { top: mm(1), bottom: mm(1), left: mm(2), right: mm(2) },
        })],
      }),
      new TableRow({
        height: { value: mm(5.5), rule: HeightRule.ATLEAST },
        children: hRow1.map(([c, l]) => hazardCell(c, l)),
      }),
      new TableRow({
        height: { value: mm(5.5), rule: HeightRule.ATLEAST },
        children: [...hRow2.map(([c, l]) => hazardCell(c, l)), hazardCell('', '')],
      }),
    ],
  });

  // ── INFO TABLE ────────────────────────────────────────────────────
  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        height: { value: mm(6), rule: HeightRule.ATLEAST },
        children: ['Project / Contract','Location / Plot','Date','Time of Inspection'].map(h => lblCell(h)),
      }),
      new TableRow({
        height: { value: mm(7), rule: HeightRule.ATLEAST },
        children: [valCell(projectName,1,true), valCell(location), valCell(displayDate), valCell(timeNow)],
      }),
    ],
  });

  // ── ROLE TABLE ────────────────────────────────────────────────────
  const roleTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        height: { value: mm(6), rule: HeightRule.ATLEAST },
        children: ['Role','Job Title','Name','Company','Signature','Date'].map(h => lblCell(h)),
      }),
      new TableRow({
        height: { value: mm(8), rule: HeightRule.ATLEAST },
        children: [valCell('Submitted to'), valCell('HSE Manager'), valCell(submittedTo), valCell(orgDisplay), valCell(''), valCell(displayDate)],
      }),
      new TableRow({
        height: { value: mm(8), rule: HeightRule.ATLEAST },
        children: [valCell('Prepared by'), valCell('HSE Engineer'), valCell(preparedBy), valCell(orgDisplay), valCell(''), valCell(displayDate)],
      }),
    ],
  });

  // ── TITLE BAR TABLE ───────────────────────────────────────────────
  const titleTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [new TableRow({
      height: { value: mm(12), rule: HeightRule.ATLEAST },
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: orgDisplay, bold: true, size: 20, color: WHITE })], alignment: AlignmentType.LEFT })],
          shading: shade(NAVY), borders: noBorder(), verticalAlign: VerticalAlign.CENTER,
          width: { size: 25, type: WidthType.PERCENTAGE },
          margins: { top: mm(2), bottom: mm(2), left: mm(3), right: mm(2) },
        }),
        new TableCell({
          children: [
            new Paragraph({ children: [new TextRun({ text: 'HEALTH, SAFETY AND ENVIRONMENT', bold: true, size: 22, color: WHITE })], alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun({ text: 'HSE OBSERVATION REPORT', bold: true, size: 17, color: 'B8D4EC' })], alignment: AlignmentType.CENTER }),
          ],
          shading: shade(NAVY), borders: noBorder(), verticalAlign: VerticalAlign.CENTER,
          width: { size: 50, type: WidthType.PERCENTAGE },
          margins: { top: mm(2), bottom: mm(2), left: mm(2), right: mm(2) },
        }),
        new TableCell({
          children: [new Paragraph({ children: [] })],
          shading: shade(NAVY), borders: noBorder(),
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
      ],
    })],
  });

  // ── OBSERVATION TABLE ─────────────────────────────────────────────
  const OBS_COLS = [
    { label: ['SN'],                         w: 5  },
    { label: ['Hazard','Code'],              w: 8  },
    { label: ['Photo','Initial'],            w: 10 },
    { label: ['Hazards / Aspects','& Risk / Impact'], w: 22 },
    { label: ['Recommended','Corrective Action'], w: 22 },
    { label: ['Responsible','Person'],       w: 13 },
    { label: ['Cat.'],                       w: 6  },
    { label: ['Date to','Complete'],         w: 10 },
    { label: ['Photo','Final'],              w: 10 },
    { label: ['Date','Completed'],           w: 10 },
  ];
  const colWidths = OBS_COLS.map(c => ({ size: Math.round(c.w * 100), type: WidthType.PERCENTAGE }));

  const obsHeaderRow = new TableRow({
    tableHeader: true,
    height: { value: mm(10), rule: HeightRule.ATLEAST },
    children: OBS_COLS.map((col, i) => new TableCell({
      children: col.label.map(line => new Paragraph({
        children: [new TextRun({ text: line, bold: true, size: 14, color: WHITE })],
        alignment: AlignmentType.CENTER,
      })),
      shading: shade(NAVY), borders: thinBorder(WHITE),
      verticalAlign: VerticalAlign.CENTER,
      width: colWidths[i],
      margins: { top: mm(1), bottom: mm(1), left: mm(1), right: mm(1) },
    })),
  });

  const obsDataRows = observations.map((obs, idx) => {
    const rowFill = idx % 2 === 0 ? WHITE : LGREY;
    const vals = [
      String(idx + 1),
      obs.hazard_codes || '-',
      '(see photo)',
      obs.description || '-',
      obs.recommendation || '-',
      obs.responsible_person || '-',
      obs.risk_level || '-',
      obs.timeframe || '-',
      '(see photo)',
      obs.status === 'Closed' ? displayDate : '-',
    ];
    return new TableRow({
      height: { value: mm(16), rule: HeightRule.ATLEAST },
      children: vals.map((val, ci) => new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: String(val), size: 15, color: '1A1A1A' })],
          alignment: ci === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
        })],
        shading: shade(rowFill),
        borders: thinBorder('9DBDD4'),
        verticalAlign: VerticalAlign.TOP,
        width: colWidths[ci],
        margins: { top: mm(1.2), bottom: mm(1.2), left: mm(1.2), right: mm(1.2) },
      })),
    });
  });

  const obsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [obsHeaderRow, ...obsDataRows],
  });

  // ── FOOTER ────────────────────────────────────────────────────────
  const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [new TableRow({
      height: { value: mm(6), rule: HeightRule.ATLEAST },
      children: [
        makeCell('TASETI/FRM/HSE/019  Rev:-00', { size: 13, color: '1A3A5C', fill: NAVY_BG, align: AlignmentType.LEFT }),
        makeCell('Page 1 of 1', { size: 13, color: '1A3A5C', fill: NAVY_BG, align: AlignmentType.CENTER }),
        makeCell(`FLAGIT HSE Observation Platform | ${displayDate}`, { size: 13, color: '1A3A5C', fill: NAVY_BG, align: AlignmentType.RIGHT }),
      ],
    })],
  });

  const sp = () => new Paragraph({ children: [], spacing: { before: mm(1.5), after: mm(1.5) } });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: convertInchesToTwip(16.54), height: convertInchesToTwip(11.69) }, // A4 landscape
          margin: { top: mm(12), bottom: mm(12), left: mm(12), right: mm(12) },
        },
      },
      children: [titleTable, sp(), infoTable, sp(), roleTable, sp(), hazardTable, sp(), obsTable, sp(), footerTable],
    }],
  });

  const buffer = await Packer.toBuffer(doc);

  // Filename: DDMMYYYY-LOCATION.docx
  const d = dateStr.replace(/-/g, '');
  const locTag = (location || projectName).toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g,'').slice(0, 30) || 'SITE';
  const filename = `${d.slice(6)}${d.slice(4,6)}${d.slice(0,4)}-${locTag}.docx`;

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
};
