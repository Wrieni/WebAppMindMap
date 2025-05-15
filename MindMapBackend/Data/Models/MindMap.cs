using System;
using System.Collections.Generic;

namespace MindMapBackend.Data.Models;

public partial class MindMap
{
    public int id { get; set; }

    public string? title { get; set; }

    public DateTimeOffset? createdat { get; set; }

    public DateTimeOffset? updatedat { get; set; }

    public bool? ispublic { get; set; }

    public int? userid { get; set; }

    public virtual ICollection<Connection> Connections { get; set; } = new List<Connection>();

    public virtual ICollection<History> Histories { get; set; } = new List<History>();

    public virtual ICollection<Node> Nodes { get; set; } = new List<Node>();

    public virtual User? user { get; set; }
}
