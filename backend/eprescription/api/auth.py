from rest_framework.permissions import BasePermission

def InGroup(group_name):
    class IsInGroup(BasePermission):
        def has_permission(self, request, view):
            # Check if the user has a GP profile associated with them
            return request.user.groups.filter(name=group_name).exists()
    return IsInGroup
