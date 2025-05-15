using System;
using System.Collections.Generic;

namespace MindMapBackend.Data.Models;

public partial class Connection
{
    public int id { get; set; }

    public int? sourcenodeid { get; set; }

    public int? targetnodeid { get; set; }

    public string type { get; set; } = null!;

    public int? mindmapid { get; set; }

    public virtual MindMap? mindmap { get; set; }

    public virtual Node? sourcenode { get; set; }

    public virtual Node? targetnode { get; set; }
}
