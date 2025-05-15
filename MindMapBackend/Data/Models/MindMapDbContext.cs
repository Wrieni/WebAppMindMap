using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MindMapBackend.Data.Models;

public partial class MindMapDbContext : DbContext
{
    public MindMapDbContext()
    {
    }

    public MindMapDbContext(DbContextOptions<MindMapDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Connection> Connections { get; set; }

    public virtual DbSet<History> Histories { get; set; }

    public virtual DbSet<MindMap> MindMaps { get; set; }

    public virtual DbSet<Node> Nodes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=mindmap;Username=postgres;Password=");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Connection>(entity =>
        {
            entity.HasKey(e => e.id).HasName("Connection_pkey");

            entity.ToTable("Connection");

            entity.Property(e => e.type).HasColumnType("character varying");

            entity.HasOne(d => d.mindmap).WithMany(p => p.Connections)
                .HasForeignKey(d => d.mindmapid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_mindmapid");

            entity.HasOne(d => d.sourcenode).WithMany(p => p.Connectionsourcenodes)
                .HasForeignKey(d => d.sourcenodeid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_sourcenodeid");

            entity.HasOne(d => d.targetnode).WithMany(p => p.Connectiontargetnodes)
                .HasForeignKey(d => d.targetnodeid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_targetnodeid");
        });

        modelBuilder.Entity<History>(entity =>
        {
            entity.HasKey(e => e.id).HasName("History_pkey");

            entity.ToTable("History");

            entity.Property(e => e.savedate).HasColumnType("time with time zone");

            entity.HasOne(d => d.mindmap).WithMany(p => p.Histories)
                .HasForeignKey(d => d.mindmapid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_historymindmap");
        });

        modelBuilder.Entity<MindMap>(entity =>
        {
            entity.HasKey(e => e.id).HasName("MindMap_pkey");

            entity.ToTable("MindMap");

            entity.Property(e => e.createdat).HasColumnType("time with time zone");
            entity.Property(e => e.title).HasColumnType("character varying");
            entity.Property(e => e.updatedat).HasColumnType("time with time zone");

            entity.HasOne(d => d.user).WithMany(p => p.MindMaps)
                .HasForeignKey(d => d.userid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_usermindmap");
        });

        modelBuilder.Entity<Node>(entity =>
        {
            entity.HasKey(e => e.id).HasName("Node_pkey");

            entity.ToTable("Node");

            entity.Property(e => e.title).HasColumnType("character varying");

            entity.HasOne(d => d.mindmap).WithMany(p => p.Nodes)
                .HasForeignKey(d => d.mindmapid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_minpmapnode");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.id).HasName("User_pkey");

            entity.ToTable("User");

            entity.Property(e => e.email).HasColumnType("character varying");
            entity.Property(e => e.name).HasColumnType("character varying");
            entity.Property(e => e.password).HasColumnType("character varying");
            entity.Property(e => e.role).HasColumnType("character varying");
            entity.Property(e => e.surname).HasColumnType("character varying");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
