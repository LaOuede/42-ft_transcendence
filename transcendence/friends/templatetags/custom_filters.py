from django import template

register = template.Library()

@register.filter
def get_status_color(activity):
    user_status_colors = {
    'ON': 'green',
    'OF': 'red',
    'IG': 'purple',
    'UN': 'yellow'
    }
    
    return user_status_colors.get(activity, "grey")