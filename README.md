datatables-filterrange
======================

Plugin for DataTables that provides a filter method that accepts a range of values.
Only works for per-column filtering.

### Usage

Enable the plugin using `F` in your `sDom` property.
To filter by a range, call `fnFilterRange("start", "end", columnIndex)` on your DataTable instance. Content in column should be comparable naturally by JavaScript.

If `bServerSide` is true, then the plugin will add `bRange_(int)=true` and `bSearchEnd_(int)=end` to the parameters passed to the server per request. The start parameter will be set to `bSearch_(int)`.

Searching is cleared if either `start` or `end` parameters are empty.