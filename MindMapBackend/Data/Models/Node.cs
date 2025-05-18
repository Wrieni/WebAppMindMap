using System;
using System.Collections.Generic;

namespace MindMapBackend.Data.Models;

public partial class Node
{
    public int id { get; set; }

    public int? mindmapid { get; set; }

    public string title { get; set; } = null!;

    public string description { get; set; } = null!;

    public double positionx { get; set; }

    public double positiony { get; set; }

    public string color { get; set; } = null!;

    public virtual ICollection<Connection> Connectionsourcenodes { get; set; } = new List<Connection>();

    public virtual ICollection<Connection> Connectiontargetnodes { get; set; } = new List<Connection>();

    public virtual MindMap? mindmap { get; set; }
}
