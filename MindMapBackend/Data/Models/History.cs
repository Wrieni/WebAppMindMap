using System;
using System.Collections.Generic;

namespace MindMapBackend.Data.Models;

public partial class History
{
    public int id { get; set; }

    public int? mindmapid { get; set; }

    public int? userid { get; set; }

    public string? action { get; set; }

    public DateTimeOffset? savedate { get; set; }

    public string? snapshotjson { get; set; }

    public virtual MindMap? mindmap { get; set; }
}
