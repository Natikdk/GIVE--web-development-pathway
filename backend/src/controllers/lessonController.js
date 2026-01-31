const Lesson = require('../models/Lesson');
const url = require('url');

const lessonController = {
  handleRoutes: async (req, res) => {
    console.log(`Lesson controller: ${req.method} ${req.url}`);
    
    // Use Node.js url module for parsing
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // GET /api/lessons
    if (method === 'GET' && pathname === '/api/lessons') {
      try {
        console.log('Fetching all lessons...');
        const lessons = await Lesson.find({}).select("topic slug sections");
        console.log(`Found ${lessons.length} lessons`);
        
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(lessons));
      } catch (err) {
        console.error('Error fetching lessons:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      }
      return;
    }

    // GET /api/lessons/:slug
    if (method === 'GET' && pathname.startsWith('/api/lessons/')) {
      // Extract slug from pathname
      const slug = pathname.split('/')[3];
      
      if (!slug) {
        res.writeHead(400, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        });
        res.end(JSON.stringify({ message: "Slug parameter required" }));
        return;
      }

      try {
        console.log(`Fetching lesson with slug: ${slug}`);
        const lesson = await Lesson.findOne({ slug: slug });

        if (!lesson) {
          console.log(`Lesson not found: ${slug}`);
          res.writeHead(404, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          });
          res.end(JSON.stringify({ message: "Lesson not found" }));
          return;
        }

        console.log(`Found lesson: ${lesson.topic}`);
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(lesson));
      } catch (err) {
        console.error('Error fetching lesson:', err);
        res.writeHead(500, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        });
        res.end(JSON.stringify({ message: err.message }));
      }
      return;
    }

    // POST /api/lessons
    if (method === 'POST' && pathname === '/api/lessons') {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const lessonData = JSON.parse(body);
          console.log('Creating lesson:', lessonData.topic);
          
          const lesson = new Lesson({
            topic: lessonData.topic,
            slug: lessonData.slug,
            sections: lessonData.sections,
          });

          const savedLesson = await lesson.save();
          res.writeHead(201, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify(savedLesson));
        } catch (err) {
          if (err.name === 'SyntaxError') {
            res.writeHead(400, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' 
            });
            res.end(JSON.stringify({ message: 'Invalid JSON data' }));
          } else {
            res.writeHead(400, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' 
            });
            res.end(JSON.stringify({ message: err.message }));
          }
        }
      });
      return;
    }

    // If no route matches
    console.log(`Lesson route not found: ${pathname}`);
    res.writeHead(404, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
};

module.exports = lessonController;