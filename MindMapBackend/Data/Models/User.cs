using System;
using System.Collections.Generic;

namespace MindMapBackend.Data.Models;

public partial class User
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public string surname { get; set; } = null!;

    public string email { get; set; } = null!;

    public string password { get; set; } = null!;

    public string role { get; set; } = null!;

    public virtual ICollection<MindMap> MindMaps { get; set; } = new List<MindMap>();
}
