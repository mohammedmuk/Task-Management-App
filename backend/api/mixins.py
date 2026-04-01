

class UserQuerySetMixins():
    user_define = 'owner'

    
    def get_queryset(self, *args, **kwargs):
      user = self.request.user
      lookup_data = {}
      lookup_data[self.user_define] = user

      qs = super().get_queryset(*args, **kwargs)
      return qs.filter(**lookup_data)