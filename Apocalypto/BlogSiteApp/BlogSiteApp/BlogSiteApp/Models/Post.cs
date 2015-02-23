using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Mvc;

namespace BlogSiteApp.Models
{
    public class Post
    {
        public int PostId { set; get; }
        [Required]
        public string Title { set; get; }
        [UIHint("tinymce_full")]
        [AllowHtml]
        public string Description { set; get; }
        public DateTime PostedDate { set; get; }
        public bool IsPublished { set; get; }
        public int NoOfView { set; get; }
        public int UserId { set; get; }
        public virtual User User { set; get; }
        public virtual ICollection<Comment> Comments { set; get; } 
    }

}