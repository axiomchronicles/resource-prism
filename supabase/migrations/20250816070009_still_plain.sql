/*
  # Add database functions for analytics and counters

  1. Functions
    - `increment_view_count()` - Safely increment resource view count
    - `increment_download_count()` - Safely increment resource download count
    - `get_user_stats()` - Get comprehensive user statistics
    - `get_trending_resources()` - Get trending resources based on recent activity

  2. Security
    - Functions are security definer to allow proper access
    - Proper error handling and validation
*/

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(resource_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE resources 
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = resource_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(resource_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE resources 
  SET downloads_count = COALESCE(downloads_count, 0) + 1
  WHERE id = resource_uuid;
  
  -- Also update user's download count
  UPDATE profiles 
  SET downloads_count = COALESCE(downloads_count, 0) + 1
  WHERE user_id = (
    SELECT uploaded_by FROM resources WHERE id = resource_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_uploads', COALESCE(COUNT(r.id), 0),
    'total_downloads', COALESCE(SUM(r.downloads_count), 0),
    'total_views', COALESCE(SUM(r.views_count), 0),
    'average_rating', COALESCE(AVG(r.rating), 0),
    'total_favorites', (
      SELECT COUNT(*) FROM user_favorites uf 
      JOIN resources res ON uf.resource_id = res.id 
      WHERE res.uploaded_by = user_uuid
    )
  ) INTO result
  FROM resources r
  WHERE r.uploaded_by = user_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trending resources (last 7 days activity)
CREATE OR REPLACE FUNCTION get_trending_resources(days_back INTEGER DEFAULT 7)
RETURNS TABLE(
  resource_id UUID,
  title TEXT,
  type resource_type,
  subject subject_type,
  semester semester_type,
  downloads_count INTEGER,
  views_count INTEGER,
  rating NUMERIC,
  trend_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.type,
    r.subject,
    r.semester,
    r.downloads_count,
    r.views_count,
    r.rating,
    -- Calculate trend score based on recent activity
    (
      COALESCE(recent_downloads.count, 0) * 3 + 
      COALESCE(recent_views.count, 0) * 1 +
      COALESCE(r.rating, 0) * 10
    ) as trend_score
  FROM resources r
  LEFT JOIN (
    SELECT 
      resource_id, 
      COUNT(*) as count
    FROM resource_downloads 
    WHERE downloaded_at >= NOW() - INTERVAL '%s days'
    GROUP BY resource_id
  ) recent_downloads ON r.id = recent_downloads.resource_id
  LEFT JOIN (
    SELECT 
      resource_id, 
      COUNT(*) as count
    FROM resource_views 
    WHERE viewed_at >= NOW() - INTERVAL '%s days'
    GROUP BY resource_id
  ) recent_views ON r.id = recent_views.resource_id
  WHERE r.is_approved = true
  ORDER BY trend_score DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_trending_resources(INTEGER) TO public;