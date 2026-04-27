# =============================================================
# daily_update_excel.ps1
# Generates daily_updates.xlsx using Open XML (no Python/Excel needed)
# =============================================================

param(
    [string]$OutputDir = $PSScriptRoot
)

# ── DATE RANGE — auto-fills every date from StartDate to EndDate ─
$StartDate = [System.DateTime]::new(2026, 1, 5)    # 05-Jan-2026
$EndDate   = [System.DateTime]::new(2026, 4, 1)    # 01-Apr-2026

# ── TASKS template — repeated for every date in the range ────
$taskTemplate = @(
    [ordered]@{ Task="Review project requirements";  Status="Done";        Comments="All requirements confirmed with client" },
    [ordered]@{ Task="Fix login page bug";           Status="In Progress"; Comments="JWT token expiry issue identified" },
    [ordered]@{ Task="Deploy to staging server";     Status="Pending";     Comments="Waiting for QA sign-off" }
)
# ─────────────────────────────────────────────────────────────

$todayLabel = Get-Date -Format "dd-MMM-yyyy"
$filePath   = Join-Path $OutputDir "daily_updates.xlsx"

# ── Colour map (ARGB hex, no alpha prefix needed for Open XML) ─
$colours = @{
    "done"        = "C6EFCE"   # green
    "in progress" = "FFEB9C"   # yellow
    "pending"     = "FFC7CE"   # pink/red
    "header"      = "1F4E79"   # dark blue
    "alt"         = "D6E4F0"   # light blue
}

# ══════════════════════════════════════════════════
# Build the Open XML strings
# ══════════════════════════════════════════════════

function Rgb2Theme([string]$hex) { return "FF$hex" }   # add full opacity prefix

# Shared strings (all text lives here in xlsx format)
$sharedStrings = [System.Collections.Generic.List[string]]::new()
function GetSI([string]$val) {
    $idx = $sharedStrings.IndexOf($val)
    if ($idx -lt 0) { $sharedStrings.Add($val); $idx = $sharedStrings.Count - 1 }
    return $idx
}

# Pre-register headers
$headers = @("Date","Task / Activity","Status","Comments / Notes")
foreach ($h in $headers) { [void](GetSI $h) }

# Build rows data — one row per WEEKDAY (Mon–Fri) in the range
$rows      = [System.Collections.Generic.List[object]]::new()
$totalDays = 0
$cursor    = $StartDate
while ($cursor -le $EndDate) {
    if ($cursor.DayOfWeek -ne [System.DayOfWeek]::Saturday -and
        $cursor.DayOfWeek -ne [System.DayOfWeek]::Sunday) {

        $dateSerial = [int]$cursor.ToOADate()
        $t = $taskTemplate[0]
        $rows.Add(@{
            DateSerial = $dateSerial
            Task       = GetSI $t.Task
            Status     = GetSI $t.Status
            Comments   = GetSI $t.Comments
            StatusLow  = $t.Status.ToLower()
        })
        $totalDays++
    }
    $cursor = $cursor.AddDays(1)
}

# ── workbook.xml ────────────────────────────────────────────
$workbookXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Daily Updates" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>
'@

# ── workbook.xml.rels ────────────────────────────────────────
$workbookRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"   Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"       Target="styles.xml"/>
</Relationships>
'@

# ── [Content_Types].xml ─────────────────────────────────────
$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml"            ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml"   ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/sharedStrings.xml"       ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
  <Override PartName="/xl/styles.xml"              ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>
'@

# ── _rels/.rels ─────────────────────────────────────────────
$rootRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>
'@

# ── styles.xml — defines fills/fonts for header + status cells ─
function MakeStylesXml {
    # fills: 0=none(required), 1=gray(required), 2=header, 3=done, 4=inprogress, 5=pending, 6=alt
    $fillsXml = @"
  <fills count="7">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="$(Rgb2Theme $colours['header'])"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="$(Rgb2Theme $colours['done'])"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="$(Rgb2Theme $colours['in progress'])"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="$(Rgb2Theme $colours['pending'])"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="$(Rgb2Theme $colours['alt'])"/></patternFill></fill>
  </fills>
"@
    # fonts: 0=default, 1=header(white bold), 2=body
    $fontsXml = @"
  <fonts count="3">
    <font><sz val="10"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><sz val="10"/><name val="Calibri"/></font>
  </fonts>
"@
    # borders: 0=none, 1=thin all sides
    $bordersXml = @"
  <borders count="2">
    <border><left/><right/><top/><bottom/></border>
    <border>
      <left   style="thin"><color rgb="FFB0B0B0"/></left>
      <right  style="thin"><color rgb="FFB0B0B0"/></right>
      <top    style="thin"><color rgb="FFB0B0B0"/></top>
      <bottom style="thin"><color rgb="FFB0B0B0"/></bottom>
    </border>
  </borders>
"@
    # numFmts: id 164+ are custom. 164 = "dd-mmm-yyyy" (e.g. 01-Apr-2026)
    $numFmtsXml = @"
  <numFmts count="1">
    <numFmt numFmtId="164" formatCode="dd-mmm-yyyy"/>
  </numFmts>
"@
    # cellXfs (styles):
    #  0=default
    #  1=header       (fill=2 header blue, font=1, border=1, center)
    #  2=date-alt     (fill=6 alt,  font=2, border=1, center, numFmt=164 DATE)
    #  3=text/left    (fill=6 alt,  font=2, border=1, left)
    #  4=status-done  (fill=3, font=2, border=1, center)
    #  5=status-prog  (fill=4, font=2, border=1, center)
    #  6=status-pend  (fill=5, font=2, border=1, center)
    #  7=text-noalt   (fill=0, font=2, border=1, left)
    #  8=date-noalt   (fill=0, font=2, border=1, center, numFmt=164 DATE)
    $xfsXml = @"
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="9">
    <xf numFmtId="0"   fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0"   fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="164" fontId="2" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1" applyNumberFormat="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0"   fontId="2" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left"   vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0"   fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0"   fontId="2" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0"   fontId="2" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0"   fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left"   vertical="center" wrapText="1"/></xf>
    <xf numFmtId="164" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1" applyNumberFormat="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
  </cellXfs>
"@
    return @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
$numFmtsXml
$fontsXml
$fillsXml
$bordersXml
$xfsXml
</styleSheet>
"@
}

# ── sharedStrings.xml ────────────────────────────────────────
function MakeSharedStringsXml {
    $count = $sharedStrings.Count
    $items = ($sharedStrings | ForEach-Object { "<si><t xml:space=`"preserve`">$([System.Security.SecurityElement]::Escape($_))</t></si>" }) -join "`n"
    return @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="$count" uniqueCount="$count">
$items
</sst>
"@
}

# ── sheet1.xml ───────────────────────────────────────────────
function MakeSheetXml {
    # Open XML worksheet element order (MUST follow spec):
    # sheetViews → sheetFormatPr → cols → sheetData → autoFilter

    $colLetters = @("A","B","C","D")

    # ── build rows HTML ──────────────────────────────────────
    $rowsSb = [System.Text.StringBuilder]::new()

    # header row (style index 1 = header blue)
    [void]$rowsSb.AppendLine('  <row r="1" ht="22" customHeight="1">')
    for ($i = 0; $i -lt 4; $i++) {
        $si = GetSI $headers[$i]
        [void]$rowsSb.AppendLine("    <c r=`"$($colLetters[$i])1`" t=`"s`" s=`"1`"><v>$si</v></c>")
    }
    [void]$rowsSb.AppendLine('  </row>')

    # data rows
    $rowNum = 2
    foreach ($r in $rows) {
        $isAlt   = ($rowNum % 2 -eq 0)
        $dateSt  = if ($isAlt) { "2" } else { "8" }
        $textSt  = if ($isAlt) { "3" } else { "7" }
        $statusSt = switch ($r.StatusLow) {
            "done"        { "4" }
            "in progress" { "5" }
            default       { "6" }
        }
        [void]$rowsSb.AppendLine("  <row r=`"$rowNum`" ht=`"18`" customHeight=`"1`">")
        # Date cell: numeric (no t="s"), Excel serial number — style applies date format
        [void]$rowsSb.AppendLine("    <c r=`"A$rowNum`" s=`"$dateSt`"><v>$($r.DateSerial)</v></c>")
        [void]$rowsSb.AppendLine("    <c r=`"B$rowNum`" t=`"s`" s=`"$textSt`"><v>$($r.Task)</v></c>")
        [void]$rowsSb.AppendLine("    <c r=`"C$rowNum`" t=`"s`" s=`"$statusSt`"><v>$($r.Status)</v></c>")
        [void]$rowsSb.AppendLine("    <c r=`"D$rowNum`" t=`"s`" s=`"$textSt`"><v>$($r.Comments)</v></c>")
        [void]$rowsSb.AppendLine("  </row>")
        $rowNum++
    }

    $lastRow = $rowNum - 1

    return @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
           xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <cols>
    <col min="1" max="1" width="18"  customWidth="1"/>
    <col min="2" max="2" width="42"  customWidth="1"/>
    <col min="3" max="3" width="18"  customWidth="1"/>
    <col min="4" max="4" width="52"  customWidth="1"/>
  </cols>
  <sheetData>
$($rowsSb.ToString())  </sheetData>
  <autoFilter ref="A1:D$lastRow"/>
</worksheet>
"@
}

# ══════════════════════════════════════════════════
# Package as .xlsx (ZIP archive)
# ══════════════════════════════════════════════════
Add-Type -AssemblyName System.IO.Compression.FileSystem

$tmpDir = Join-Path $env:TEMP "xlsx_build_$(Get-Random)"
New-Item -ItemType Directory -Path $tmpDir | Out-Null

# Create folder structure
$xlDir   = Join-Path $tmpDir "xl"
$wsDir   = Join-Path $xlDir  "worksheets"
$relsDir = Join-Path $tmpDir "_rels"
$xlRels  = Join-Path $xlDir  "_rels"

@($xlDir,$wsDir,$relsDir,$xlRels) | ForEach-Object { New-Item -ItemType Directory -Path $_ | Out-Null }

# Write all XML files
[System.IO.File]::WriteAllText((Join-Path $tmpDir    "[Content_Types].xml"),       $contentTypes,        [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText((Join-Path $relsDir   ".rels"),                     $rootRels,            [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText((Join-Path $xlDir     "workbook.xml"),              $workbookXml,         [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText((Join-Path $xlRels    "workbook.xml.rels"),         $workbookRels,        [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText((Join-Path $xlDir     "styles.xml"),                (MakeStylesXml),      [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText((Join-Path $xlDir     "sharedStrings.xml"),         (MakeSharedStringsXml),[System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText((Join-Path $wsDir     "sheet1.xml"),                (MakeSheetXml),       [System.Text.Encoding]::UTF8)

# Remove old file if exists
if (Test-Path $filePath) { Remove-Item $filePath -Force }

# Zip temp dir → .xlsx
[System.IO.Compression.ZipFile]::CreateFromDirectory($tmpDir, $filePath)

# Cleanup
Remove-Item -Recurse -Force $tmpDir

Write-Host ""
Write-Host "[SUCCESS] Excel report created: $filePath"
Write-Host "          Range  : $($StartDate.ToString('dd-MMM-yyyy'))  →  $($EndDate.ToString('dd-MMM-yyyy'))  ($totalDays days)"
Write-Host "          Rows   : $($rows.Count) total (1 row × $totalDays days)"
Write-Host ""
