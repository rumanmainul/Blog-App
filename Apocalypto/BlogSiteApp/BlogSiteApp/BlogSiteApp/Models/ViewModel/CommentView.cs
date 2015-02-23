using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BlogSiteApp.Models.ViewModel
{
    public class CommentView
    {
        public int PosterId { set; get; }
        public string PosterName { set; get; }
        public string CommentDescription { set; get; }
        public int CommentId { set; get; }
        public string CommentDate { set; get; }
    }
}