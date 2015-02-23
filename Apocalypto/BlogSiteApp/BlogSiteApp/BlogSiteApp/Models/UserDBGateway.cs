using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace BlogSiteApp.Models
{
    public class UserDBGateway:DbContext
    {
        public UserDBGateway()
            : base("BlogDb")
        {
            Configuration.ProxyCreationEnabled = false;   
        }
        public DbSet<User> Users { set; get; }
        public DbSet<Post> Posts { set; get; }
        public DbSet<Comment> Comments { set; get; } 
    }
}