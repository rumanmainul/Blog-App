using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BlogSiteApp.Models
{
    public class Comment
    {
        public int CommentId { set; get; }
        public string Description { set; get; }
        public DateTime CommentDate { set; get; }
        public bool IsDeleted { set; get; }
        
        public int PostId { set; get; }
        public int UserId { set; get; }
        public virtual User User { set; get; }
        public virtual Post Post { set; get; }
    }
}